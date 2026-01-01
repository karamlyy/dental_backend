import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateServiceDto {
    @ApiProperty({
    example: 'Diş dolğusu',
    required: false,
  })
    @IsNotEmpty()
    @IsString()
    name: string;


    @ApiProperty({
        example: 'Diş dolğusu ödənişi',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    price?: number;
}
