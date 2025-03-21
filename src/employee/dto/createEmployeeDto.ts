export class CreateEmployeeDto {
  name: string;
  position: string;

  phone?: string;
  email?: string;

  tasks?: number[];

  areaId: number;
  username: string;
  password: string
  roleId: number
}
