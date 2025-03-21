import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
import { Asset } from '../entities/region/asset.entity';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get('assets')
  findAll(): Promise<Asset[]> {
    return this.assetService.findAll();
  }

  @Get('area/:areaId')
  findByArea(@Param('areaId', ParseIntPipe) areaId: number): Promise<Asset[]> {
    return this.assetService.findByArea(areaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Asset> {
    return this.assetService.findOne(id);
  }

  @Post('create')
  create(@Body() createAssetDto: CreateAssetDto): Promise<Asset> {
    return this.assetService.create(createAssetDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssetDto: UpdateAssetDto,
  ): Promise<Asset> {
    return this.assetService.update(id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.assetService.remove(id);
  }

  @Get()
  findByQueryCategory(@Query('category') category: string) {
    if (category) {
      return this.assetService.findByCategory(category);
    }
    return this.assetService.findAll();
  }
}
