import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority } from '../../common/enums/ticket-priority.enum';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

export class CreateSupportTicketDto {
  @ApiProperty({ example: 'Internet connection issue' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'Technical Support' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ enum: TicketPriority, default: TicketPriority.MEDIUM })
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @ApiProperty({ example: 'My internet connection has been slow for the past few days...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: TicketStatus, default: TicketStatus.OPEN })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({ example: 'technician-uuid' })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}