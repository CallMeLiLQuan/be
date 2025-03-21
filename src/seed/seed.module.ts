import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Role } from 'src/entities/auth/role.entity';
import { User } from 'src/entities/auth/user.entity';
import { Permission } from 'src/entities/auth/permission.entity';
import { UserRole } from 'src/entities/auth/user-role.entity';
import { RolePermission } from 'src/entities/auth/role-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
