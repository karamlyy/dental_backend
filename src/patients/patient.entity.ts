import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, AfterLoad } from 'typeorm';
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

    @Column({ type: 'decimal', default: 0 })
    totalAmount: number;

    @Column({ type: 'decimal', default: 0 })
    paidAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { nullable: false })
    doctor: User;

    @OneToMany(() => Appointment, (appointment) => appointment.patient, { cascade: true })
    appointments: Appointment[];

    @OneToMany(() => Payment, (payment) => payment.patient, { cascade: true })
    payments: Payment[];

    debt: number;

    @AfterLoad()
    calculateDebt() {
        this.debt = Number(this.totalAmount) - Number(this.paidAmount);
    }
}