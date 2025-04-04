import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Land } from './land.entity';
import { Area } from './area.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ default: 0 })
  quantity: number;

  @Column('json', { nullable: true })
  properties: Array<{ key: string; value: string | number | boolean }>;

  @Column('json', { nullable: true })
  plantInfo: {
    growthStage: string;
    lastWatered: string;
    fertilizerUsed: string;
  };

  @ManyToOne(() => Land, { nullable: true })
  @JoinColumn({ name: 'landId' })
  land: Land;

  @Column({ nullable: true })
  landId: number;

  @ManyToOne(() => Area, { nullable: true })
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @Column({ nullable: true })
  areaId: number;

  @Column({ nullable: true })
  landName: string;

  @Column({ nullable: true })
  areaName: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  purchaseDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  value: number;

  @Column({ nullable: true })
  assignedTo: number;

  @Column({ default: 'other' })
  category: string;
} 