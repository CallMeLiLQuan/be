import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task_type' })
export class TaskType {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: string;
  @Column()
  description: string;
}
