// src/stats/stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';
import { Patient } from '../patients/patient.entity';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async getHomeStats(doctorId: string) {
    /** 📅 Today range */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    /** ⏰ Now */
    const now = new Date();
    const nowTime = now.toTimeString().slice(0, 5); // "HH:mm"

    // 1️⃣ Bugünkü appointment sayı
    const todayAppointments = await this.appointmentRepo.count({
      where: {
        doctor: { id: doctorId },
        date: Between(todayStart, todayEnd),
      },
    });

    // 2️⃣ Aktiv pasiyent sayı
    const totalPatients = await this.patientRepo.count({
      where: {
        doctor: { id: doctorId },
      },
    });

    // 3️⃣ Növbəti appointment
    const nextAppointment = await this.appointmentRepo.findOne({
      where: [
        // Bu gündən sonrakılar
        {
          doctor: { id: doctorId },
          status: AppointmentStatus.CONFIRMED,
          date: MoreThan(todayEnd),
        },
        // Bu gün + vaxtı keçməyən
        {
          doctor: { id: doctorId },
          status: AppointmentStatus.CONFIRMED,
          date: Between(todayStart, todayEnd),
          startTime: MoreThan(nowTime),
        },
      ],
      relations: ['patient'],
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      todayAppointments,
      totalPatients,
      nextAppointment: nextAppointment
        ? {
            id: nextAppointment.id,
            date: nextAppointment.date,
            startTime: nextAppointment.startTime,
            endTime: nextAppointment.endTime,
            patientName: nextAppointment.patient.fullName,
          }
        : null,
    };
  }
}