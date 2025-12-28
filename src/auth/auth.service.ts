import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(dto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hash,
    });

    return this.generateResponse(user);
  }

  async registerAssistant(dto: any, doctorId: string) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hash,
      role: UserRole.ASSISTANT,
      doctorId: doctorId,
    });

    return this.generateResponse(user);
  }

  async login(dto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateResponse(user);
  }

  private generateResponse(user) {
    const payload = {
      sub: user.id,
      role: user.role,
      doctorId: user.role === UserRole.ASSISTANT ? user.doctorId : user.id
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      userId: user.id,
      fullName: user.fullName,
      role: user.role,
    };
  }
}