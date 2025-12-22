import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./appointment.entity";
import { Patient } from "src/patients/patient.entity";
import { AppointmentStatus } from "src/common/enums/appointment-status.enum";
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { isValidStatusTransition } from './appointment-status.util';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private repo: Repository<Appointment>,
        @InjectRepository(Patient)
        private patientRepo: Repository<Patient>,
    ) { }

    async createForPatient(dto: CreateAppointmentDto, patientId: string, doctorId: string) {
        const patient = await this.patientRepo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
        });

        if (!patient) throw new Error('Patient not found or not yours');

        const appointment = this.repo.create({
            ...dto,
            patient,
            doctor: { id: doctorId },
        });

        return this.repo.save(appointment);
    }

    async findAllByDoctor(doctorId: string) {
        return this.repo.find({
            where: { doctor: { id: doctorId } },
            relations: ['patient'],
            order: { date: 'ASC' },
        });
    }

    async findByPatient(patientId: string, doctorId: string) {
        const patient = await this.patientRepo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
        });

        if (!patient) throw new Error('Patient not found or not yours');

        return this.repo.find({
            where: { patient: { id: patientId } },
            order: { date: 'ASC' },
        });
    }


    async update(id: string, doctorId: string, dto: UpdateAppointmentDto) {
        const appointment = await this.repo.findOne({
            where: { id, doctor: { id: doctorId } },
        });

        if (!appointment)
            throw new NotFoundException('Appointment not found or not yours');

        // 🔒 Status dəyişmə qaydası
        if (dto.status && dto.status !== appointment.status) {
            const isValid = isValidStatusTransition(
                appointment.status,
                dto.status,
            );

            if (!isValid) {
                throw new BadRequestException(
                    `Invalid status transition: ${appointment.status} → ${dto.status}`,
                );
            }

            appointment.status = dto.status;
        }

        // 🕒 Tarix dəyişmə qaydası
        if (dto.date) {
            if (
                appointment.status === AppointmentStatus.COMPLETED ||
                appointment.status === AppointmentStatus.CANCELLED
            ) {
                throw new BadRequestException(
                    'Cannot change date of completed or cancelled appointment',
                );
            }

            appointment.date = new Date(dto.date);
        }

        return this.repo.save(appointment);
    }

}