import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { User } from 'src/users/user.entity';
import { PatientService } from './entities/patient-service.entity';
import { CreatePatientServiceDto } from './dto/create-patient-service.dto';

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private repo: Repository<Patient>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(PatientService)
        private patientServiceRepo: Repository<PatientService>,

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

    async addService(patientId: string, doctorId: string, dto: CreatePatientServiceDto) {
        const patient = await this.repo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
        });

        if (!patient) throw new Error('Patient not found or not yours');

        const service = this.patientServiceRepo.create({
            ...dto,
            patient,
            doctorId,
        });

        await this.patientServiceRepo.save(service);

        // Update patient totalAmount
        const price = Number(dto.price);
        patient.totalAmount = Number(patient.totalAmount) + price;
        return this.repo.save(patient);
    }

    async findServices(patientId: string, doctorId: string) {
        return this.patientServiceRepo.find({
            where: {
                patient: { id: patientId },
                doctor: { id: doctorId }
            },
            order: { createdAt: 'DESC' }
        });
    }
}