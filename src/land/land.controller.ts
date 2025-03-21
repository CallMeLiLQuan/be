import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { LandService } from './land.service';
import { Land } from '../entities/region/land.entity';
import { CreateLandDto } from './dto/creatLandDto';
import { UpdateLandDto } from './dto/land.dto';

@Controller('land')
export class LandController {
  constructor(private readonly landService: LandService) {}

  @Get()
  findAll(): Promise<Land[]> {
    return this.landService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Land> {
    return this.landService.findOne(id);
  }

  @Post()
  create(@Body() createLandDto: CreateLandDto): Promise<Land> {
    return this.landService.create(createLandDto);
  }

  // @Put(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateLandDto: UpdateLandDto,
  // ): Promise<Land> {
  //   return this.landService.update(id, updateLandDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  //   return this.landService.remove(id);
  // }
}
