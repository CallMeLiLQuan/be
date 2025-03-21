import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Land } from '../entities/region/land.entity';
import { Coordinate } from '../entities/region/coordinate.entity';
import { Owner } from '../entities/region/owner.entity';
import { Region } from '../entities/region/region.entity';
import { LandController } from './land.controller';
import { LandService } from './land.service';

@Module({
  imports: [TypeOrmModule.forFeature([Land, Coordinate, Owner, Region])],
  controllers: [LandController],
  providers: [LandService],
  exports: [LandService]
})
export class LandModule {}
