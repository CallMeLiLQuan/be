import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { TaskTypemanagementService } from './taskTypemanagement.service';
import { TaskType } from 'src/entities/task/taskTypemanagement.entity';
import { CreateTaskTypeDto } from './dto/createTaskType.dto';

@Controller('task-typemanagement')
export class TaskTypemanagementController {
  constructor(
    private readonly taskTypemanagementService: TaskTypemanagementService,
  ) {}

  // Lấy tất cả loại công việc - cho phép admin, manager và employee đã đăng nhập
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'employee')
  @Get('all')
  async findAll(): Promise<TaskType[]> {
    return await this.taskTypemanagementService.findAll();
  }

  // Tạo loại công việc mới - chỉ cho phép admin và manager
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Post('create')
  async createTaskType(
    @Body(ValidationPipe) createTaskTypeDto: CreateTaskTypeDto,
  ): Promise<TaskType> {
    return await this.taskTypemanagementService.createTaskType(
      createTaskTypeDto,
    );
  }

  // Cập nhật loại công việc theo id - chỉ cho phép admin và manager
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Put('update/:id')
  async updateTaskType(
    @Param('id') id: number,
    @Body(ValidationPipe) updateTaskTypeDto: CreateTaskTypeDto,
  ): Promise<TaskType> {
    return await this.taskTypemanagementService.updateTaskType(
      id,
      updateTaskTypeDto,
    );
  }

  // Xóa loại công việc theo id - chỉ cho phép admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete/:id')
  async deleteTaskType(@Param('id') id: number): Promise<{ message: string }> {
    await this.taskTypemanagementService.deleteTaskType(id);
    return { message: 'Xóa thành công' };
  }
}
