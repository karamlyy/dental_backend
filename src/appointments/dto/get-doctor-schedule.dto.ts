import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDoctorScheduleDto {
    @ApiProperty({ example: '2025-12-30' })
    @IsDateString()
    @IsNotEmpty()
    date: string;
}
