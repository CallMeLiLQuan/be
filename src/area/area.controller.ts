import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AreaService } from './area.service';
import { Area } from '../entities/region/area.entity';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';

@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  findAll(): Promise<Area[]> {
    return this.areaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Area> {
    return this.areaService.findOne(id);
  }

  @Get('land/:landId')
  findByLand(@Param('landId', ParseIntPipe) landId: number): Promise<Area[]> {
    return this.areaService.findByLand(landId);
  }

  @Post()
  create(@Body() createAreaDto: CreateAreaDto): Promise<Area> {
    return this.areaService.create(createAreaDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<Area> {
    return this.areaService.update(id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.areaService.remove(id);
  }
}
