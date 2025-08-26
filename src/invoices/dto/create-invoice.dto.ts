import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '../../common/enums/invoice-status.enum';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'plan-uuid' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @ApiProperty({ example: '2024-02-01T00:00:00.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 'January 2024' })
  @IsString()
  @IsNotEmpty()
  billingPeriod: string;
}