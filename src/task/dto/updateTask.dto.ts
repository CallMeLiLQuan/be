export class UpdateTaskDto {
  title?: string;
  description?: string;

  // Cho biết task có lặp lại hay không và định dạng lặp lại
  isRecurring?: boolean;
  recurrencePattern?: string;

  // Chi phí thực hiện task
  cost?: number;

  // Bộ phận hoặc phòng ban liên quan đến task
  department?: string;

  // Cập nhật liên kết với Employee: người phụ trách và người phê duyệt
  assigneeId?: number;
  approverId?: number;

  // Cập nhật quan hệ task cha nếu task này là sub-task
  parentTaskId?: number;

  // Cập nhật liên kết với Area mà task thuộc về
  areaId?: number;
}
