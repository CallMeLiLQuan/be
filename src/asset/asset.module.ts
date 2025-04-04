import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Asset } from '../entities/region/asset.entity';
import { Land } from '../entities/region/land.entity';
import { Area } from '../entities/region/area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Land, Area])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService]
})
export class AssetModule {}
