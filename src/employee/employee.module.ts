import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { Employee } from 'src/entities/employee/employee.entity';
import { AuthModule } from 'src/auth/auth.module';
import e from 'express';
import { EmployeeController } from './employee.controller';
import { Area } from 'src/entities/region/area.entity';
import { User } from 'src/entities/auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee,Area,User]),
    AuthModule,
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
