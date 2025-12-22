import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'Elvin Məmmədov' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+994501234567' })
  @IsNotEmpty()
  phone: string;
}