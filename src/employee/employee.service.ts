import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/createEmployeeDto';
import { Employee } from 'src/entities/employee/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEmployeeDto } from './dto/updatEmployeeDto';
import { AuthService } from 'src/auth/auth.service';
import { RegisterUserDto } from 'src/auth/dto/registerUserDto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly authService: AuthService,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const { name, position, phone, email, areaId, tasks, username, password, roleId } = createEmployeeDto;

    // Create the new User entity using AuthService
    const registerUserDto: RegisterUserDto = {
      username,
      email,
      password,
      roleIds: [roleId],
    };
    const newUser = await this.authService.createUser(registerUserDto);

    // Create the new Employee entity
    const newEmployee = this.employeeRepository.create({
      name,
      position,
      phone,
      email,
      areaId,
      user: newUser, // Associate the new User with the Employee
    });

    // Save the new Employee entity
    const savedEmployee = await this.employeeRepository.save(newEmployee);

    return savedEmployee;
  }

  async getAllEmployee(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async getEmployeeById(id: number): Promise<Employee> {
    return await this.employeeRepository.findOneBy({ id });
  }

  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const { name, position, phone, email, areaId, tasks } = updateEmployeeDto;
    const employee = await this.employeeRepository.findOneBy({ id });

    if (name !== undefined) {
      employee.name = name;
    }
    if (position !== undefined) {
      employee.position = position;
    }
    if (phone !== undefined) {
      employee.phone = phone;
    }
    if (email !== undefined) {
      employee.email = email;
    }
    // Nếu cần cập nhật tasks, có thể xử lý logic chuyển đổi mảng ID sang đối tượng Task tại đây

    return await this.employeeRepository.save(employee);
  }

  async deleteEmployee(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({ id });
    return await this.employeeRepository.remove(employee);
  }
}
