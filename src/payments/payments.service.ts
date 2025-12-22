import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "src/patients/patient.entity";
import { Repository } from "typeorm";
import { Payment } from "./payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private repo: Repository<Payment>,
        @InjectRepository(Patient)
        private patientRepo: Repository<Patient>,
    ) { }

    async createForPatient(dto: CreatePaymentDto, patientId: string, doctorId: string) {
        const patient = await this.patientRepo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
        });

        if (!patient) throw new Error('Patient not found or not yours');

        const payment = this.repo.create({
            ...dto,
            patient,
            doctor: { id: doctorId },
        });

        return this.repo.save(payment);
    }

    async findByPatient(patientId: string, doctorId: string) {
        const patient = await this.patientRepo.findOne({
            where: { id: patientId, doctor: { id: doctorId } },
        });

        if (!patient) throw new Error('Patient not found or not yours');

        return this.repo.find({
            where: { patient: { id: patientId } },
            order: { createdAt: 'DESC' },
        });
    }
}