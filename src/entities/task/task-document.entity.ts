import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('task_documents')
export class TaskDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Task, (task) => task.documents, { nullable: false })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  taskId: number;

  // Có thể bổ sung thêm các trường khác như thời gian tạo, kích thước file, v.v.
}
