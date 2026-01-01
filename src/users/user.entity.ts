import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Service } from '../services/entities/service.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.DOCTOR })
  role: UserRole;

  @Column({ nullable: true })
  doctorId?: string;

  @ManyToOne(() => User, (user) => user.assistants, { nullable: true })
  @JoinColumn({ name: 'doctorId' })
  doctor?: User;

  @OneToMany(() => User, (user) => user.doctor)
  assistants: User[];

  @OneToMany(() => Service, (service) => service.doctor)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;
}