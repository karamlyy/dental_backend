import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column({ type: 'decimal', nullable: true })
    price: number;

    @Column()
    doctorId: string;

    @ManyToOne(() => User, (user) => user.services)
    @JoinColumn({ name: 'doctorId' })
    doctor: User;
}
