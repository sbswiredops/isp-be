import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from '../entities/support-ticket.entity';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketsRepository: Repository<SupportTicket>,
  ) {}

  async create(userId: string, createTicketDto: CreateSupportTicketDto): Promise<SupportTicket> {
    const ticket = this.ticketsRepository.create({
      ...createTicketDto,
      userId,
    });
    return this.ticketsRepository.save(ticket);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [tickets, total] = await this.ticketsRepository.findAndCount({
      skip,
      take: limit,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: tickets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    };
  }

  async findByUserId(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [tickets, total] = await this.ticketsRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      relations: ['replies'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: tickets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    };
  }

  async findById(id: string): Promise<SupportTicket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['user', 'replies', 'replies.user'],
    });
    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateSupportTicketDto): Promise<SupportTicket> {
    await this.findById(id);
    await this.ticketsRepository.update(id, updateTicketDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findById(id);
    await this.ticketsRepository.remove(ticket);
  }
}