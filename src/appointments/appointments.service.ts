import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./appointment.entity";
import { Patient } from "../patients/patient.entity";
import { AppointmentStatus } from "../common/enums/appointment-status.enum";
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between, Not } from 'typeorm';
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { isValidStatusTransition } from './appointment-status.util';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isTimeOverlap } from "./appointment-clash.util";

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private repo: Repository<Appointment>,
        @InjectRepository(Patient)
        private patientRepo: Repository<Patient>,
    ) { }

    async createForPatient(
        dto: CreateAppointmentDto,
        patientId: string,
        doctorId: string,
    ) {
        const patient = await this.patientRepo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
        });

        if (!patient) {
            throw new BadRequestException('Patient not found or not yours');
        }

        const inputDate = new Date(dto.date);
        inputDate.setHours(0, 0, 0, 0);

        const startOfDay = new Date(inputDate);
        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);

        /** 🔎 Clash yoxlaması - Həm Həkim, həm də Pasiyent üçün */
        const clashes = await this.repo.find({
            where: [
                {
                    doctor: { id: doctorId },
                    date: Between(startOfDay, endOfDay),
                    status: Not(AppointmentStatus.CANCELLED),
                },
                {
                    patient: { id: patientId },
                    date: Between(startOfDay, endOfDay),
                    status: Not(AppointmentStatus.CANCELLED),
                }
            ],
            relations: ['doctor', 'patient'],
        });

        for (const existing of clashes) {
            if (
                isTimeOverlap(
                    dto.startTime,
                    dto.endTime,
                    existing.startTime,
                    existing.endTime,
                )
            ) {
                throw new BadRequestException(
                    `Appointment time clashes with existing appointment (${existing.startTime} - ${existing.endTime})`,
                );
            }
        }

        const appointment = this.repo.create({
            ...dto,
            patient,
            doctor: { id: doctorId },
            status: AppointmentStatus.SCHEDULED,
        });

        return this.repo.save(appointment);
    }
    async getDoctorSchedule(doctorId: string, dateStr: string) {
        const inputDate = new Date(dateStr);
        inputDate.setHours(0, 0, 0, 0);

        const startOfDay = new Date(inputDate);
        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);

        return this.repo.find({
            where: {
                doctor: { id: doctorId },
                date: Between(startOfDay, endOfDay),
                status: Not(AppointmentStatus.CANCELLED),
            },
            select: ['id', 'startTime', 'endTime', 'status', 'date'],
            order: { startTime: 'ASC' },
        });
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
            where: { id },
            relations: ['doctor'],
        });

        if (!appointment || appointment.doctor.id !== doctorId) {
            throw new NotFoundException('Appointment not found or not yours');
        }

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

        return this.repo.save(appointment);
    }

}