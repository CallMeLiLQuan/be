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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/createEmployeeDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Employee } from 'src/entities/employee/employee.entity';
import { UpdateEmployeeDto } from './dto/updatEmployeeDto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Lấy danh sách employee - cho phép admin, manager, employee
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'manager', 'employee')
  @Get('employees')
  async getAllEmployee(): Promise<Employee[]> {
    return await this.employeeService.getAllEmployee();
  }

  // Lấy thông tin employee theo id - cho phép admin, manager, employee
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'manager', 'employee')
  @Get(':id')
  async getEmployeeById(@Param('id') id: number): Promise<Employee> {
    return await this.employeeService.getEmployeeById(id);
  }

  // Tạo employee - cho phép admin và manager
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'manager')
  @Post('create')
  async createEmployee(
    @Body(ValidationPipe) createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeeService.createEmployee(createEmployeeDto);
  }

  // Cập nhật employee - cho phép admin và manager
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'manager')
  @Put('update/:id')
  async updateEmployee(
    @Param('id') id: number,
    @Body(ValidationPipe) updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  // Xóa employee - chỉ cho phép admin
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  @Delete('delete/:id')
  async deleteEmployee(@Param('id') id: number): Promise<Employee> {
    return await this.employeeService.deleteEmployee(id);
  }
}
