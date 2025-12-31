import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Patient } from '../patients/patient.entity';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { BadRequestException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

describe('AppointmentsService', () => {
    let service: AppointmentsService;
    let appointmentRepo;
    let patientRepo;

    const mockAppointmentRepo = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockPatientRepo = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentsService,
                {
                    provide: getRepositoryToken(Appointment),
                    useValue: mockAppointmentRepo,
                },
                {
                    provide: getRepositoryToken(Patient),
                    useValue: mockPatientRepo,
                },
            ],
        }).compile();

        service = module.get<AppointmentsService>(AppointmentsService);
        appointmentRepo = module.get(getRepositoryToken(Appointment));
        patientRepo = module.get(getRepositoryToken(Patient));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should prevent overlapping appointments for the same patient', async () => {
        const patientId = 'patient-1';
        const doctorId = 'doctor-1';
        const date = new Date('2025-01-01');

        const existingAppointment = {
            id: 'appt-1',
            date: date,
            startTime: '09:00',
            endTime: '10:00',
            status: AppointmentStatus.SCHEDULED,
            patient: { id: patientId },
            doctor: { id: doctorId }
        };

        // Mock patient found
        mockPatientRepo.findOne.mockResolvedValue({ id: patientId });

        // Mock existing appointments
        mockAppointmentRepo.find.mockImplementation((criteria) => {
            const where = criteria.where;
            // Service now sends array: [{doctor...}, {patient...}]
            if (Array.isArray(where)) {
                const docMatch = where.find(w => w.doctor?.id === doctorId);
                const patMatch = where.find(w => w.patient?.id === patientId);
                if (docMatch || patMatch) return Promise.resolve([existingAppointment]);
            }
            return Promise.resolve([]);
        });

        const newDto: CreateAppointmentDto = {
            date: date,
            startTime: '09:00',
            endTime: '10:30'
        };

        await expect(service.createForPatient(newDto, patientId, doctorId))
            .rejects
            .toThrow(BadRequestException);
    });

    it('should prevent overlapping appointments for the same patient with DIFFERENT doctor', async () => {
        const patientId = 'patient-1';
        const doctorId1 = 'doctor-1';
        const doctorId2 = 'doctor-2'; // Different doctor
        const date = new Date('2025-01-01');

        const existingAppointment = {
            id: 'appt-1',
            date: date,
            startTime: '09:00',
            endTime: '10:00',
            status: AppointmentStatus.SCHEDULED,
            patient: { id: patientId },
            doctor: { id: doctorId1 }
        };

        mockPatientRepo.findOne.mockResolvedValue({ id: patientId });

        mockAppointmentRepo.find.mockImplementation((criteria) => {
            const where = criteria.where;
            if (Array.isArray(where)) {
                // Check if patient matches (this is the key fix validation)
                const patMatch = where.find(w => w.patient?.id === patientId);
                if (patMatch) return Promise.resolve([existingAppointment]);
            }
            return Promise.resolve([]);
        });

        const newDto: CreateAppointmentDto = {
            date: date,
            startTime: '09:00',
            endTime: '10:30'
        };

        await expect(service.createForPatient(newDto, patientId, doctorId2))
            .rejects
            .toThrow(BadRequestException);
    });
    it('should return doctor schedule for a specific date', async () => {
        const doctorId = 'doctor-1';
        const dateStr = '2025-01-01';

        const scheduledAppt = {
            id: 'appt-1',
            startTime: '10:00',
            endTime: '11:00',
            status: AppointmentStatus.SCHEDULED,
            date: new Date(dateStr),
        };

        mockAppointmentRepo.find.mockResolvedValue([scheduledAppt]);

        const result = await service.getDoctorSchedule(doctorId, dateStr);

        expect(mockAppointmentRepo.find).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    doctor: { id: doctorId },
                }),
                select: ['id', 'startTime', 'endTime', 'status', 'date'],
                order: { startTime: 'ASC' },
            }),
        );
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(scheduledAppt);
    });
});
