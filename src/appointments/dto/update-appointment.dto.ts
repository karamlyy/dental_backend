import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    example: '2025-12-25T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}