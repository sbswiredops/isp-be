import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupportTicket } from './support-ticket.entity';
import { User } from './user.entity';

@Entity('ticket_replies')
export class TicketReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ticketId: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isInternal: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => SupportTicket, (ticket) => ticket.replies)
  @JoinColumn({ name: 'ticketId' })
  ticket: SupportTicket;

  @ManyToOne(() => User, (user) => user.ticketReplies)
  @JoinColumn({ name: 'userId' })
  user: User;
}