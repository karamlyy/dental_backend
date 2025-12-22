import { Controller, Post, Get, Body, Request, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PaymentsService } from 'src/payments/payments.service';
import { CreateAppointmentDto } from 'src/appointments/dto/create-appointment.dto';
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
    constructor(
        private service: PatientsService,
        private appointmentsService: AppointmentsService,
        private paymentsService: PaymentsService,
    ) { }
    @Roles(UserRole.DOCTOR)
    @Post()
    create(@Body() dto: CreatePatientDto, @Request() req) {
        return this.service.create(dto, req.user.sub);
    }

    @Get()
    findAll(@Request() req) {
        return this.service.findAllByDoctor(req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.service.findOne(id, req.user.sub);
    }

    @Roles(UserRole.DOCTOR)
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.service.remove(id, req.user.sub);
    }

    // 🔹 Pasiyentin appointment-ləri
    @Get(':id/appointments')
    findAppointments(@Param('id') id: string, @Request() req) {
        return this.appointmentsService.findByPatient(id, req.user.sub);
    }

    // 🔹 Pasiyentin payment-ləri
    @Get(':id/payments')
    findPayments(@Param('id') id: string, @Request() req) {
        return this.paymentsService.findByPatient(id, req.user.sub);
    }

    // 🔹 Yeni appointment yarat
  @Roles(UserRole.DOCTOR)
  @Post(':id/appointments')
  createAppointment(@Param('id') patientId: string, @Body() dto: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.createForPatient(dto, patientId, req.user.sub);
  }

  // 🔹 Yeni payment yarat
  @Roles(UserRole.DOCTOR)
  @Post(':id/payments')
  createPayment(@Param('id') patientId: string, @Body() dto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.createForPatient(dto, patientId, req.user.sub);
  }
}