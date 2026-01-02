import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Patient } from '../patient.entity';
import { User } from '../../users/user.entity';

@Entity('patient_services')
export class PatientService {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patientId' })
    patient: Patient;

    @Column()
    patientId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'doctorId' })
    doctor: User;

    @Column()
    doctorId: string;

    @CreateDateColumn()
    createdAt: Date;
}
