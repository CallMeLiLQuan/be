import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDocumentDto } from './create-task-document.dto';

export class UpdateTaskDocumentDto extends PartialType(CreateTaskDocumentDto) {}
