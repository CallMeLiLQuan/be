// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Không tìm thấy token');
    }

    const [type, token] = authHeader.split(' ');
    if (!token) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    try {
      // Xác thực JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'DQV', // bạn có thể thay bằng biến môi trường
      });
      request.user = payload;

      // Kiểm tra xem route có @SkipPermission hay không
      const skipPermission = this.reflector.get<boolean>(
        'skipPermission',
        context.getHandler(),
      );
      if (skipPermission) {
        return true;
      }

      // (Tùy chọn) Nếu muốn kiểm tra permission ngay ở đây
      // ...

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
