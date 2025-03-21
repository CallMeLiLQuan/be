import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { UserRole } from './user-role.entity';
import { Employee } from '../employee/employee.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  actived: boolean; // Thêm cột actived (hoặc bạn có thể đặt isActive)

  // Quan hệ 1-nhiều với bảng trung gian UserRole
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
  
  @OneToOne(() => Employee, (employee) => employee.user) // Không cần @JoinColumn ở đây
  employee: Employee;
}
