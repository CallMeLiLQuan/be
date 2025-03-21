import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUserDto';
import { LoginUserDto } from './dto/loginUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { User } from 'src/entities/auth/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Request } from 'express';
import { RequestWithUser } from 'src/common/interface/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Lấy danh sách user (cho phép xem với tất cả các role: admin, manager, employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'employee')
  @Get('users')
  async getAllUser(): Promise<User[]> {
    return await this.authService.getAllUser();
  }

  // Lấy thông tin chi tiết của 1 user (cho phép cho admin, manager, employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'employee')
  @Get('user/:id')
  async getUserById(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<{ message: string; data: any }> {
    const user = await this.authService.getUserById(req, id);
    if (user) {
      // Ẩn các trường nhạy cảm (ví dụ: password)
      delete user.password;
    }
    return { message: 'User found successfully', data: user };
  }

  // Đăng ký tài khoản, truyền thêm roleIds để gán Role cho User
  @Post('register')
  async registerUser(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto,
  ): Promise<User> {
    return await this.authService.createUser(registerUserDto);
  }

  // Đăng nhập, trả về JWT chứa thông tin user, các Role và Permission
  @Post('login')
  async loginUser(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    console.log('loginUserDto', loginUserDto)
    const token = await this.authService.loginUser(loginUserDto);
    console.log(token)
    return token
  }

  // Cập nhật danh sách Role cho User dựa trên userId lấy từ token (chỉ admin được phép)
  @Post('update-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateUserRoles(
    @Req() req: RequestWithUser,
    @Body('roleIds') roleIds: number[],
  ): Promise<User> {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundException('User không tồn tại');
    }
    return await this.authService.updateUserRoles(userId, roleIds);
  }

  // Cập nhật thông tin của User (email, password, …)
  // Cho phép admin và manager sửa, tuy nhiên manager không được sửa user có role admin
  @Put('update-user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  async updateUser(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Lấy thông tin user cần cập nhật
    const userToUpdate = await this.authService.getUserById(req, id);
    if (!userToUpdate) {
      throw new NotFoundException('User không tồn tại');
    }
    // Lấy danh sách role của user cần cập nhật (từ mảng userRoles)
    const userToUpdateRoles = userToUpdate.userRoles.map((ur) => ur.role.name);
    // Lấy danh sách role của người gọi từ JWT payload (giả sử payload chứa 'roles' dưới dạng mảng)
    const requesterRoles: string[] = req.user.roles;
    if (
      userToUpdateRoles.includes('admin') &&
      !requesterRoles.includes('admin')
    ) {
      throw new ForbiddenException('Chỉ admin mới được cập nhật user admin');
    }
    return await this.authService.updateUser(id, updateUserDto);
  }

  // Xóa User theo ID (chỉ admin mới có quyền xoá)
  @Delete('delete-user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    return await this.authService.deleteUser(id);
  }
}
