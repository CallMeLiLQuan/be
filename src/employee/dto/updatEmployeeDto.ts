export class UpdateEmployeeDto {
  name?: string;
  position?: string;
  phone: string;
  email: string;

  // Tương tự, cho phép cập nhật tasks (nếu muốn gán task mới hoặc bỏ bớt)
  tasks?: number[];

  // Khai báo areaId tuỳ chọn
  areaId?: number;
}
