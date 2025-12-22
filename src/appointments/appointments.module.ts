import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Patient } from 'src/patients/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService], // ✅ export əlavə et
})
export class AppointmentsModule {}