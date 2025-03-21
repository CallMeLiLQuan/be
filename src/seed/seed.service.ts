import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/auth/role.entity';
import { User } from 'src/entities/auth/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/entities/auth/user-role.entity';
import { RolePermission } from 'src/entities/auth/role-permission.entity';
import { Permission } from 'src/entities/auth/permission.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async run() {
    // Kiểm tra số lượng dữ liệu trong bảng
    const userCount = await this.userRepository.count();
    const roleCount = await this.roleRepository.count();
    const permissionCount = await this.permissionRepository.count();

    // Nếu các bảng User, Role và Permission chưa có dữ liệu, tiến hành seed
    if (userCount === 0 && roleCount === 0 && permissionCount === 0) {
      // 1. Tạo 3 role: admin, manager, employee
      const adminRole = this.roleRepository.create({
        name: 'admin',
        isHiden: false,
        description: 'Role admin với đầy đủ quyền hạn',
      });
      const managerRole = this.roleRepository.create({
        name: 'manager',
        isHiden: false,
        description: 'Role manager với quyền hạn trung bình',
      });
      const employeeRole = this.roleRepository.create({
        name: 'employee',
        isHiden: false,
        description: 'Role employee với quyền hạn giới hạn',
      });
      await this.roleRepository.save([adminRole, managerRole, employeeRole]);

      // 2. Tạo một số Permission mẫu
      const permissionsData = [
        { name: 'all_all', description: 'Toàn quyền truy cập' },
        { name: 'create_user', description: 'Tạo người dùng' },
        { name: 'update_user', description: 'Cập nhật người dùng' },
        { name: 'delete_user', description: 'Xóa người dùng' },
        { name: 'view_user', description: 'Xem người dùng' },
      ];
      const permissionEntities = permissionsData.map((data) =>
        this.permissionRepository.create(data),
      );
      await this.permissionRepository.save(permissionEntities);

      // 3. Gán Permission cho Role thông qua RolePermission
      // - Gán cho admin: permission "all"
      const allPermission = await this.permissionRepository.findOne({
        where: { name: 'all_all' },
      });
      if (allPermission) {
        const adminRP = this.rolePermissionRepository.create({
          role: adminRole,
          permission: allPermission,
        });
        await this.rolePermissionRepository.save(adminRP);
      }

      // - Gán cho manager: permission "update_user" và "view_user"
      const updateUserPermission = await this.permissionRepository.findOne({
        where: { name: 'update_user' },
      });
      const viewUserPermission = await this.permissionRepository.findOne({
        where: { name: 'view_user' },
      });
      if (updateUserPermission && viewUserPermission) {
        const managerRP1 = this.rolePermissionRepository.create({
          role: managerRole,
          permission: updateUserPermission,
        });
        const managerRP2 = this.rolePermissionRepository.create({
          role: managerRole,
          permission: viewUserPermission,
        });
        await this.rolePermissionRepository.save([managerRP1, managerRP2]);
      }

      // - Gán cho employee: permission "view_user"
      if (viewUserPermission) {
        const employeeRP = this.rolePermissionRepository.create({
          role: employeeRole,
          permission: viewUserPermission,
        });
        await this.rolePermissionRepository.save(employeeRP);
      }

      // 4. Tạo một admin user
      const hashedPassword = await bcrypt.hash('123', 10);
      const adminUser = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        email: 'abc@gmail.com',
        actived: true,
      });
      await this.userRepository.save(adminUser);

      // 5. Gán role admin cho admin user qua bảng UserRole
      const adminUserRole = this.userRoleRepository.create({
        user: adminUser,
        role: adminRole,
      });
      await this.userRoleRepository.save(adminUserRole);

      console.log('Seed data created successfully.');
    } else {
      console.log('Seed data already exists.');
    }
  }
}
