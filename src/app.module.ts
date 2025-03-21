import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreaModule } from './area/area.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { TaskModule } from './task/task.module';

import { RegionModule } from './region/region.module';
import { LandModule } from './land/land.module';
import { CoordinateModule } from './coordinate/coordinate.module';
import { OwnerModule } from './owner/owner.module';
import { AssetModule } from './asset/asset.module';
import { TaskDocumentModule } from './task-document/task-document.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '103.229.42.113',
      port: 3306,
      username: 'root',
      password: 'lht@39412990',
      database: 'QLDD',
      logging: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TaskModule,
    EmployeeModule,
    AreaModule,
    AuthModule,
    SeedModule,
    RegionModule,
    LandModule,
    CoordinateModule,
    OwnerModule,
    AssetModule,
    TaskDocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
