import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskType } from 'src/entities/task/taskTypemanagement.entity';
import { Repository } from 'typeorm';
import { CreateTaskTypeDto } from './dto/createTaskType.dto';
import { UpdateTaskTypeDto } from './dto/updateTaskType.dto';

@Injectable()
export class TaskTypemanagementService {
  constructor(
    @InjectRepository(TaskType)
    private readonly taskTypeRepository: Repository<TaskType>,
  ) {}

  // Lấy tất cả TaskType
  async findAll(): Promise<TaskType[]> {
    return await this.taskTypeRepository.find();
  }

  // Tìm TaskType theo id
  async findOne(id: number): Promise<TaskType> {
    const taskType = await this.taskTypeRepository.findOne({ where: { id } });
    if (!taskType) {
      throw new NotFoundException(`TaskType with id ${id} not found`);
    }
    return taskType;
  }

  // Tạo mới TaskType
  async createTaskType(
    createTaskTypeDto: CreateTaskTypeDto,
  ): Promise<TaskType> {
    // Kiểm tra trùng tên (nếu cần)
    const existing = await this.taskTypeRepository.findOne({
      where: { type: createTaskTypeDto.type },
    });
    if (existing) {
      throw new ConflictException('TaskType với tên này đã tồn tại');
    }
    const newTaskType = this.taskTypeRepository.create(createTaskTypeDto);
    return await this.taskTypeRepository.save(newTaskType);
  }

  // Cập nhật TaskType theo id
  async updateTaskType(
    id: number,
    updateTaskTypeDto: UpdateTaskTypeDto,
  ): Promise<TaskType> {
    const taskType = await this.findOne(id);
    const updatedTaskType = Object.assign(taskType, updateTaskTypeDto);
    return await this.taskTypeRepository.save(updatedTaskType);
  }

  // Xóa TaskType theo id
  async deleteTaskType(id: number): Promise<{ message: string }> {
    const taskType = await this.findOne(id);
    await this.taskTypeRepository.remove(taskType);
    return { message: 'TaskType đã được xóa thành công' };
  }
}
