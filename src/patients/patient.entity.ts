import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Payment } from '../payments/payment.entity';

@Entity('patients')
export class Patient {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    fullName: string;

    @Column()
    phone: string;

    @CreateDateColumn()
    createdAt: Date;

    // Hər pasiyentə aid həkim
    @ManyToOne(() => User, { nullable: false })
    doctor: User;

    @OneToMany(() => Appointment, (appointment) => appointment.patient, { cascade: true })
    appointments: Appointment[];

    @OneToMany(() => Payment, (payment) => payment.patient, { cascade: true })
    payments: Payment[];
}