import { Module } from '@nestjs/common';
import { TaskTypemanagementController } from './taskTypemanagement.controller';
import { TaskTypemanagementService } from './taskTypemanagement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskType } from '../entities/task/taskTypemanagement.entity'; // Sửa đường dẫn import
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskType]),
    AuthModule,
    // Sử dụng forFeature thay vì forRoot
  ],
  controllers: [TaskTypemanagementController],
  providers: [TaskTypemanagementService],
  exports: [TaskTypemanagementService], // Export nếu cần dùng ở module khác
})
export class TaskTypemanagementModule {}
