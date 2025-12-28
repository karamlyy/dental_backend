import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 150 })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'Diş dolğusu ödənişi',
    required: false,
  })
  @IsString()
  @IsOptional()
  note: string;
}