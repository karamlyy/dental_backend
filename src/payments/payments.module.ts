import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Patient } from 'src/patients/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Patient])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService], 
})
export class PaymentsModule {}