import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupportTicketsService } from './support-tickets.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiResponse({ status: 201, description: 'Support ticket created successfully' })
  @Post()
  create(@Request() req, @Body() createTicketDto: CreateSupportTicketDto) {
    return this.supportTicketsService.create(req.user.id, createTicketDto);
  }

  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiResponse({ status: 200, description: 'Support tickets retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.supportTicketsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get user support tickets' })
  @ApiResponse({ status: 200, description: 'User support tickets retrieved successfully' })
  @Get('my-tickets')
  findMyTickets(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.supportTicketsService.findByUserId(req.user.id, paginationDto);
  }

  @ApiOperation({ summary: 'Get support ticket by ID' })
  @ApiResponse({ status: 200, description: 'Support ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Support ticket not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportTicketsService.findById(id);
  }

  @ApiOperation({ summary: 'Update support ticket' })
  @ApiResponse({ status: 200, description: 'Support ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Support ticket not found' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateSupportTicketDto) {
    return this.supportTicketsService.update(id, updateTicketDto);
  }

  @ApiOperation({ summary: 'Delete support ticket' })
  @ApiResponse({ status: 200, description: 'Support ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Support ticket not found' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportTicketsService.remove(id);
  }
}