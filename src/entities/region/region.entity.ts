import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Land } from './land.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'json', nullable: true })
  properties: Record<string, any>[];

  @OneToMany(() => Land, land => land.region)
  lands: Land[];
} 