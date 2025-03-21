import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../task/task.entity';
import { Area } from '../region/area.entity';
import { User } from '../auth/user.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  /**
   * Danh sách các Task mà Employee này được giao (là người phụ trách)
   */
  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  /**
   * Danh sách các Task mà Employee này là người phê duyệt
   */
  @OneToMany(() => Task, (task) => task.approver)
  approvedTasks: Task[];

  @ManyToOne(() => Area, (area) => area.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @Column({ nullable: true })
  areaId: number;

  /**
   * Quan hệ One-to-One với User.
   * Với tùy chọn cascade: true, khi tạo Employee sẽ tự động tạo User đi kèm.
   */
  @OneToOne(() => User, (user) => user.employee, { cascade: true })
  @JoinColumn()
  user: User;
}
