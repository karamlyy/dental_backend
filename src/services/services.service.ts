import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) { }

    async create(doctorId: string, createServiceDto: CreateServiceDto): Promise<Service> {
        const service = this.servicesRepository.create({
            ...createServiceDto,
            doctorId,
        });
        return this.servicesRepository.save(service);
    }

    async findAll(doctorId: string): Promise<Service[]> {
        return this.servicesRepository.find({
            where: { doctorId },
        });
    }

    async remove(id: string, doctorId: string): Promise<void> {
        await this.servicesRepository.delete({ id, doctorId });
    }
}
