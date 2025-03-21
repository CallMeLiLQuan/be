import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true; // Không yêu cầu role cụ thể
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Kiểm tra user.roles có tồn tại và là mảng
    if (!user || !Array.isArray(user.roles)) {
      return false;
    }

    // Cho phép nếu có ít nhất một role của user nằm trong danh sách required roles
    return roles.some((role) => user.roles.includes(role));
  }
}
