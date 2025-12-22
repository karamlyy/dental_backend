import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 150 })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'Diş dolğusu ödənişi',
    required: false,
  })
  note?: string;
}