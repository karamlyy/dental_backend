import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED,
    description: 'New status of the appointment',
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}