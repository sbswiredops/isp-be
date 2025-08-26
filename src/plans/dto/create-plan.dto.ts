import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @ApiProperty({ example: 'Basic Internet Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: '100 Mbps' })
  @IsString()
  @IsNotEmpty()
  speed: string;

  @ApiPropertyOptional({ example: 'High-speed internet for home use' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({ example: ['Unlimited data', '24/7 support'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  contractLength?: number;
}