import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskDocumentService } from './task-document.service';
import { TaskDocumentController } from './task-document.controller';
import { TaskDocument } from 'src/entities/task/task-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskDocument])], // Đảm bảo có dòng này
  providers: [TaskDocumentService],
  controllers: [TaskDocumentController],
  exports: [TaskDocumentService],
})
export class TaskDocumentModule {}
