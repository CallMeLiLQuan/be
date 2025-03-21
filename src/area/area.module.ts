import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { Area } from '../entities/region/area.entity';
import { Land } from '../entities/region/land.entity';
import { Coordinate } from '../entities/region/coordinate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Area, Land, Coordinate])],
  providers: [AreaService],
  controllers: [AreaController],
  exports: [AreaService]
})
export class AreaModule {}
