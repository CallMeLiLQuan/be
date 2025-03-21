import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth/user.entity';
import { Role } from 'src/entities/auth/role.entity';
import { Permission } from 'src/entities/auth/permission.entity';
import { UserRole } from 'src/entities/auth/user-role.entity';
import { RolePermission } from 'src/entities/auth/role-permission.entity';
import { RegisterUserDto } from './dto/registerUserDto';
import { LoginUserDto } from './dto/loginUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
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
    private readonly jwtService: JwtService,
  ) { }

  // Lấy danh sách user, bao gồm thông tin các role (qua bảng trung gian)
  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  // Tìm user bằng id và load các thông tin liên quan đến role và permission
  async getUserById(request: Request, id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
      ],
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return user;
  }

  // Tạo user mới và gán role cho user nếu có truyền roleIds trong DTO
  // async createUser(registerUserDto: RegisterUserDto): Promise<User> {
  //   const { username, email, password, roleIds } = registerUserDto;
  //   const existingUser = await this.userRepository.findOne({
  //     where: [{ username }, { email }],
  //   });
  //   if (existingUser) {
  //     throw new ConflictException('Username hoặc Email đã tồn tại!');
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const newUser = this.userRepository.create({
  //     username,
  //     email,
  //     password: hashedPassword,
  //   });
  //   const savedUser = await this.userRepository.save(newUser);

  //   // Gán các role cho user (nếu có)
  //   if (roleIds && roleIds.length > 0) {
  //     for (const roleId of roleIds) {
  //       const role = await this.roleRepository.findOne({
  //         where: { id: roleId },
  //       });
  //       if (!role) {
  //         throw new NotFoundException(`Role với id ${roleId} không tồn tại`);
  //       }
  //       const userRole = this.userRoleRepository.create({
  //         user: savedUser,
  //         role,
  //       });
  //       await this.userRoleRepository.save(userRole);
  //     }
  //   }
  //   return savedUser;
  // }
  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, email, password, roleIds } = registerUserDto;
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Username hoặc Email đã tồn tại!');
    }
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    // Gán các role cho user thông qua bảng user_roles
    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        const role = await this.roleRepository.findOne({
          where: { id: roleId },
        });
        if (!role) {
          throw new NotFoundException(`Role với id ${roleId} không tồn tại`);
        }
        const userRole = this.userRoleRepository.create({
          user: savedUser,
          role,
        });
        await this.userRoleRepository.save(userRole);
      }
    }
    return savedUser;
  }
  // User login: Xác thực thông tin và tạo token chứa thông tin roles và permissions
  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginUserDto);
    // Load thông tin user kèm quan hệ
    const userData = await this.userRepository.findOne({
      where: { id: user.id },
      relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
      ],
    });
    // Lấy danh sách Role
    const roles = userData.userRoles.map((ur) => ur.role.name);
    // Tổng hợp Permission từ các Role
    const permissionsSet = new Set<string>();
    userData.userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissionsSet.add(rp.permission.name);
      });
    });
    const permissions = Array.from(permissionsSet);
    const payload = {
      username: user.username,
      sub: user.id,
      roles,
      permissions,
    };
    console.log(payload)
    const access_token = this.jwtService.sign(payload)
    console.log(access_token)
    return {
      access_token: access_token,
    };
  }

  // Xác thực user
  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }
    return user;
  }

  // Cập nhật các role cho user (thay vì cập nhật permission trực tiếp)
  async updateUserRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles'],
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    // Xóa các liên kết hiện có trong bảng user_roles
    if (user.userRoles && user.userRoles.length > 0) {
      await this.userRoleRepository.remove(user.userRoles);
    }
    // Thêm các role mới
    for (const roleId of roleIds) {
      const role = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!role) {
        throw new NotFoundException(`Role với id ${roleId} không tồn tại`);
      }
      const userRole = this.userRoleRepository.create({ user, role });
      await this.userRoleRepository.save(userRole);
    }
    // Load lại thông tin user đầy đủ
    return await this.getUserById(null, userId);
  }

  // Cập nhật thông tin user (có thể cập nhật password, email, v.v.)
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    // Nếu cập nhật password thì mã hoá lại
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
    return updatedUser;
  }

  // Xóa user và xóa các mối liên kết trong bảng user_roles
  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles'],
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    if (user.userRoles && user.userRoles.length > 0) {
      await this.userRoleRepository.remove(user.userRoles);
    }
    await this.userRepository.remove(user);
    return { message: 'Xóa user thành công' };
  }
}
