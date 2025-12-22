import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  
  @ApiProperty({ example: '2025-12-25T00:00:00.000Z' })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: '10:00' })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '10:30' })
  @IsNotEmpty()
  endTime: string;
}