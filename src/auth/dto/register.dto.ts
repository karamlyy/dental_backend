import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'rza@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Dr. Rza Ismayilov' })
  @IsNotEmpty()
  fullName: string;
}