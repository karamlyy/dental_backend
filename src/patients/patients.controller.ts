import { Controller, Post, Get, Body, Request, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PaymentsService } from 'src/payments/payments.service';
import { CreateAppointmentDto } from 'src/appointments/dto/create-appointment.dto';
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';
import { CreatePatientServiceDto } from './dto/create-patient-service.dto';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
    constructor(
        private service: PatientsService,
        private appointmentsService: AppointmentsService,
        private paymentsService: PaymentsService,
    ) { }

    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Post()
    create(@Body() dto: CreatePatientDto, @Request() req) {
        return this.service.create(dto, req.user.doctorId);
    }

    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Get()
    findAll(@Request() req, @Query('search') search?: string) {
        return this.service.findAllByDoctor(req.user.doctorId, search);
    }

    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.service.findOne(id, req.user.doctorId);
    }

    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.service.remove(id, req.user.doctorId);
    }

    // 🔹 Pasiyentin appointment-ləri
    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Get(':id/appointments')
    findAppointments(@Param('id') id: string, @Request() req) {
        return this.appointmentsService.findByPatient(id, req.user.doctorId);
    }

    // 🔹 Pasiyentin payment-ləri
    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Get(':id/payments')
    findPayments(@Param('id') id: string, @Request() req) {
        return this.paymentsService.findByPatient(id, req.user.doctorId);
    }

    // 🔹 Yeni appointment yarat
    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Post(':id/appointments')
    createAppointment(@Param('id') patientId: string, @Body() dto: CreateAppointmentDto, @Request() req) {
        return this.appointmentsService.createForPatient(dto, patientId, req.user.doctorId);
    }

    // 🔹 Yeni payment yarat
    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Post(':id/payments')
    createPayment(@Param('id') patientId: string, @Body() dto: CreatePaymentDto, @Request() req) {
        return this.paymentsService.createForPatient(dto, patientId, req.user.doctorId);
    }

    // 🔹 Pasiyentə xidmət (borc) əlavə et
    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Post(':id/services')
    addService(@Param('id') patientId: string, @Body() dto: CreatePatientServiceDto, @Request() req) {
        return this.service.addService(patientId, req.user.doctorId, dto);
    }

    // 🔹 Pasiyentin servisləri
    @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
    @Get(':id/services')
    getServices(@Param('id') patientId: string, @Request() req) {
        return this.service.findServices(patientId, req.user.doctorId);
    }
}