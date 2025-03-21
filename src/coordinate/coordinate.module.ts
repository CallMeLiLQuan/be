import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinateController } from './coordinate.controller';
import { CoordinateService } from './coordinate.service';
import { Coordinate } from '../entities/region/coordinate.entity';
import { Land } from '../entities/region/land.entity';
import { Area } from '../entities/region/area.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Coordinate, Land, Area])],
  controllers: [CoordinateController],
  providers: [CoordinateService],
  exports: [CoordinateService]
})
export class CoordinateModule {}
