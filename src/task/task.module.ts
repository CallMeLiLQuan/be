import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task/task.entity'; // Sửa đường dẫn import
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule, // Sử dụng forFeature thay vì forRoot
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Export nếu cần dùng ở module khác
})
export class TaskModule {}
