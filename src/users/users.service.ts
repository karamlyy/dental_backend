import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) { }

  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findAssistantsByDoctor(doctorId: string) {
    return this.repo.find({
      where: { doctor: { id: doctorId }, role: UserRole.ASSISTANT },
    });
  }

  async removeAssistant(id: string, doctorId: string) {
    const assistant = await this.repo.findOne({
      where: { id, doctor: { id: doctorId }, role: UserRole.ASSISTANT },
    });
    if (!assistant) throw new Error('Assistant not found or not yours');
    return this.repo.remove(assistant);
  }
}