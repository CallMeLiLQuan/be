import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CoordinateService } from './coordinate.service';
import { Coordinate } from '../entities/region/coordinate.entity';
import { CreateCoordinateDto, UpdateCoordinateDto } from './dto/coordinate.dto';

@Controller('coordinate')
export class CoordinateController {
  constructor(private readonly coordinateService: CoordinateService) {}

  @Post()
  async create(@Body() createCoordinateDto: CreateCoordinateDto) {
    console.log('Received coordinate data:', createCoordinateDto);
    return this.coordinateService.create(createCoordinateDto);
  }

  @Get()
  findAll() {
    return this.coordinateService.findAll();
  }

  @Get('land/:id')
  findCoordinateByLandId(@Param('id') id: string) {
    console.log('Received land id:', id);
    return this.coordinateService.findCoordinateByLandId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinateService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCoordinateDto: UpdateCoordinateDto) {
    return this.coordinateService.update(+id, updateCoordinateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordinateService.remove(+id);
  }
}
