import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskDocumentService } from './task-document.service';
import { CreateTaskDocumentDto } from './dto/create-task-document.dto';
import { UpdateTaskDocumentDto } from './dto/update-task-document.dto';

@Controller('task-documents')
export class TaskDocumentController {
  constructor(private readonly taskDocumentService: TaskDocumentService) {}

  @Post()
  async create(@Body() createTaskDocumentDto: CreateTaskDocumentDto) {
    return this.taskDocumentService.create(createTaskDocumentDto);
  }

  @Get()
  async findAll() {
    return this.taskDocumentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskDocumentService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDocumentDto: UpdateTaskDocumentDto,
  ) {
    return this.taskDocumentService.update(+id, updateTaskDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.taskDocumentService.remove(+id);
  }
}
