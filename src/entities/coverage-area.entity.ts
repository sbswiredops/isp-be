import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('coverage_areas')
export class CoverageArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  state: string;

  @Column('simple-array')
  zipCodes: string[];

  @Column('simple-array')
  districts: string[];

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  expansionPlan: string;

  @Column('simple-array')
  serviceTypes: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}