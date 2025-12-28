import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private repo: Repository<Patient>,
        @InjectRepository(User)
        private userRepo: Repository<User>,

    ) { }

    async create(dto, doctorId: string) {
        const doctor = await this.userRepo.findOneBy({ id: doctorId });
        const patient = this.repo.create({ ...dto, doctor });
        return this.repo.save(patient);
    }

    async findAllByDoctor(doctorId: string, search?: string) {
        const where: any = { doctor: { id: doctorId } };

        if (search) {
            where.fullName = ILike(`%${search}%`);
        }

        return this.repo.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(patientId: string, doctorId: string) {
        return this.repo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
            relations: ['doctor'],
        });
    }

    async remove(patientId: string, doctorId: string) {
        // yalnız həkimin öz pasiyenti silə bilər
        const patient = await this.repo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
        });

        if (!patient) throw new Error('Patient not found or not yours');

        return this.repo.remove(patient);
    }

    async findOneWithDetails(patientId: string, doctorId: string) {
        const patient = await this.repo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
            relations: ['appointments', 'payments'],
        });

        if (!patient) throw new Error('Patient not found or not yours');

        return patient;
    }
}