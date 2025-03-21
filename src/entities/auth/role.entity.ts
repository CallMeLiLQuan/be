import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';
import { RolePermission } from './role-permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: false })
  isHiden: boolean;

  @Column({ nullable: true })
  description?: string;

  // Quan hệ 1-nhiều với UserRole
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  // Quan hệ 1-nhiều với RolePermission
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
