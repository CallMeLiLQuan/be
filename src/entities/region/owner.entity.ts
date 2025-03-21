import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Land } from './land.entity';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column('int')
  landCount: number;

  @Column({ type: 'json', nullable: true })
  properties: {
    key: string;
    value: string | number | boolean;
  }[];

  @OneToMany(() => Land, land => land.owner)
  lands: Land[];
} 