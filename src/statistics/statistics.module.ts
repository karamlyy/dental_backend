// src/stats/stats.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from '../appointments/appointment.entity';
import { Patient } from '../patients/patient.entity';
import { StatsController } from './statistics.controller';
import { StatsService } from './statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}