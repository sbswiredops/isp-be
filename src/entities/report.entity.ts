import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  dateRange: string;

  @Column()
  format: string;

  @Column({ default: false })
  includeCharts: boolean;

  @CreateDateColumn()
  generatedAt: Date;

  @Column('uuid')
  generatedBy: string;
}