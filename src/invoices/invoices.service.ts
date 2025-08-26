import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { InvoiceStatus } from '../common/enums/invoice-status.enum';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoicesRepository.create({
      ...createInvoiceDto,
      dueDate: new Date(createInvoiceDto.dueDate),
    });
    return this.invoicesRepository.save(invoice);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [invoices, total] = await this.invoicesRepository.findAndCount({
      skip,
      take: limit,
      relations: ['user', 'plan'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    };
  }

  async findById(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async findByUserId(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [invoices, total] = await this.invoicesRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    };
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    await this.findById(id);
    const updateData = { ...updateInvoiceDto };
    if (updateInvoiceDto.dueDate) {
      updateData.dueDate = new Date(updateInvoiceDto.dueDate);
    }
    await this.invoicesRepository.update(id, updateData);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findById(id);
    await this.invoicesRepository.remove(invoice);
  }

  async markAsPaid(id: string): Promise<Invoice> {
    await this.invoicesRepository.update(id, {
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
    });
    return this.findById(id);
  }
}