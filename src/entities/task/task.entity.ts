import { Employee } from '../employee/employee.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Area } from '../region/area.entity';
import { TaskDocument } from './task-document.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Employee, (employee) => employee.assignedTasks, {
    nullable: true,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee: Employee;

  @Column({ nullable: true })
  assigneeId: number;

  @OneToMany(() => TaskDocument, (taskDocument) => taskDocument.task)
  documents: TaskDocument[];

  @ManyToOne(() => Task, (task) => task.subTasks, { nullable: true })
  @JoinColumn({ name: 'parentTaskId' })
  parentTask: Task;

  @Column({ nullable: true })
  parentTaskId: number;

  @OneToMany(() => Task, (task) => task.parentTask)
  subTasks: Task[];

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurrencePattern: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost: number;

  @ManyToOne(() => Employee, (employee) => employee.approvedTasks, {
    nullable: true,
  })
  @JoinColumn({ name: 'approverId' })
  approver: Employee;

  @Column({ nullable: true })
  approverId: number;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  areaId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  taskTypeId: number;
  @ManyToOne(() => Area, (area) => area.tasks, { nullable: true })
  @JoinColumn({ name: 'areaId' })
  area: Area;
}
