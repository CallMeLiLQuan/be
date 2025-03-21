import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  purchaseDate: string;

  @Column({ nullable: true })
  value: number;

  @Column({ nullable: true })
  assignedTo: number;

  @Column({ default: 'other' })
  category: string;
} 