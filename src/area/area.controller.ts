import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<Area> {
    try {
      const updatedArea = await this.areaService.update(id, updateAreaDto);
      return updatedArea;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.message === 'Invalid coordinate format') {
        throw new BadRequestException('Invalid coordinate format provided');
      }
      throw new InternalServerErrorException('Error updating area');
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.areaService.remove(id);
  }
}
