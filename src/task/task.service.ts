import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/entities/task/task.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Lấy danh sách task
  async findTask(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  // Tạo mới task
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // TypeORM sẽ tự động set created_date qua @CreateDateColumn() nếu bạn đã đổi tên
    const newTask = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(newTask);
  }

  // Cập nhật task theo id
  async updateTask(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    await this.taskRepository.update(taskId, updateTaskDto);
    return this.taskRepository.findOneBy({ id: taskId });
  }

  // Xóa task theo id
  async deleteTask(taskId: number): Promise<void> {
    await this.taskRepository.delete(taskId);
  }
}
