import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDocument } from 'src/entities/task/task-document.entity';
import { Repository } from 'typeorm';
import { CreateTaskDocumentDto } from './dto/create-task-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTaskDocumentDto } from './dto/update-task-document.dto';

@Injectable()
export class TaskDocumentService {
  constructor(
    @InjectRepository(TaskDocument)
    private taskDocumentRepository: Repository<TaskDocument>,
  ) {}

  async create(
    createTaskDocumentDto: CreateTaskDocumentDto,
  ): Promise<TaskDocument> {
    const newTaskDocument = this.taskDocumentRepository.create(
      createTaskDocumentDto,
    );
    return this.taskDocumentRepository.save(newTaskDocument);
  }

  async findAll(): Promise<TaskDocument[]> {
    return this.taskDocumentRepository.find();
  }

  async findOne(id: number): Promise<TaskDocument> {
    const taskDocument = await this.taskDocumentRepository.findOne({
      where: { id },
    });
    if (!taskDocument) {
      throw new NotFoundException(`TaskDocument với id ${id} không tồn tại`);
    }
    return taskDocument;
  }

  async update(
    id: number,
    updateTaskDocumentDto: UpdateTaskDocumentDto,
  ): Promise<TaskDocument> {
    await this.taskDocumentRepository.update(id, updateTaskDocumentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.taskDocumentRepository.delete(id);
  }
}
