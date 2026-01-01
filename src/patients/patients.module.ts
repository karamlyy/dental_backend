import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PaymentsModule } from '../payments/payments.module';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, User]),
    AppointmentsModule, // ✅ AppointmentsService üçün
    PaymentsModule,     // ✅ PaymentsService üçün
  ],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule { }