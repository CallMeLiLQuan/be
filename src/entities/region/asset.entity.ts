import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Area } from './area.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('int')
  quantity: number;

  @Column({ type: 'json', nullable: true })
  properties: Record<string, any>[];


  @Column({ nullable: true })
  landId: number;

  @Column({ nullable: true })
  areaId: number;

  @ManyToOne(() => Area, area => area.assets)
  @JoinColumn({ name: 'areaId' })
  area: Area;

  // Thông tin bổ sung cho tài sản là cây trồng
  @Column({ type: 'json', nullable: true })
  plantInfo?: {
    age: number;
    wateringSchedule: {
      frequency: 'daily' | 'weekly' | 'monthly';
      amount: number;
      description: string;
    };
  };

  @Column()
  landName: string;

  @Column()
  areaName: string;

  @Column({ type: 'varchar', default: 'other', length: 50 })
  category: string;
} 