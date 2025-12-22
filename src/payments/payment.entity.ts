import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { User } from '../users/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.payments, { onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => User) // həkim ↔ payment
  doctor: User;

  @Column('decimal')
  amount: number;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}