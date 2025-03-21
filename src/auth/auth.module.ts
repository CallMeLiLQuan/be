import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/auth/user.entity';
import { Role } from 'src/entities/auth/role.entity';
import { Permission } from 'src/entities/auth/permission.entity';
import { UserRole } from 'src/entities/auth/user-role.entity';
import { RolePermission } from 'src/entities/auth/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'DQV',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService], // Export AuthService here
})
export class AuthModule {}
