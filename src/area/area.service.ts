import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../entities/region/area.entity';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';
import { Coordinate, Point } from '../entities/region/coordinate.entity';
import { Land } from '../entities/region/land.entity';
import { AreaClassification } from './enums/area-classification.enum';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
    @InjectRepository(Coordinate)
    private coordinateRepository: Repository<Coordinate>,
    @InjectRepository(Land)
    private landRepository: Repository<Land>
  ) {}

  async findAll(): Promise<Area[]> {
    return await this.areaRepository.find({
      relations: ['land', 'coordinates', 'employees', 'tasks']
    });
  }

  async findOne(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['land', 'coordinates', 'employees', 'tasks']
    });
    
    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }
    
    return area;
  }

  async findByLand(landId: number): Promise<Area[]> {
    return await this.areaRepository.find({
      where: { land: { id: landId } },
      relations: ['land', 'coordinates', 'employees', 'tasks']
    });
  }

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    try {
      // Find land
      const land = await this.landRepository.findOne({
        where: { id: createAreaDto.landId }
      });
      if (!land) {
        throw new NotFoundException(`Land with ID ${createAreaDto.landId} not found`);
      }

      // Create coordinate
      const coordinate = new Coordinate();
      coordinate.polygon = typeof createAreaDto.coordinates.polygon === 'string' 
        ? JSON.parse(createAreaDto.coordinates.polygon) as [number, number][]
        : createAreaDto.coordinates.polygon;
      coordinate.center = typeof createAreaDto.coordinates.center === 'string'
        ? JSON.parse(createAreaDto.coordinates.center) as Point
        : createAreaDto.coordinates.center;
      coordinate.zoom = createAreaDto.coordinates.zoom;
      
      const savedCoordinate = await this.coordinateRepository.save(coordinate);

      // Create area
      const area = new Area();
      area.name = createAreaDto.name;
      area.areaName = createAreaDto.areaName;
      area.landPlot = createAreaDto.landPlot;
      area.status = createAreaDto.status;
      area.area = createAreaDto.area;
      area.usage = createAreaDto.usage;
      area.classification = createAreaDto.classification as AreaClassification;
      area.coordinates = savedCoordinate;
      area.land = land;
      area.employees = [];
      area.tasks = [];

      const savedArea = await this.areaRepository.save(area);
      
      // Update land's areaCount
      land.areaCount = (land.areaCount || 0) + 1;
      await this.landRepository.save(land);

      return savedArea;
    } catch (error) {
      // If there's an error, clean up the coordinate if it was created
      if (error.coordinates?.id) {
        await this.coordinateRepository.remove(error.coordinates);
      }
      console.error('Error creating area:', error);
      throw error;
    }
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const area = await this.findOne(id);

    if (updateAreaDto.coordinates) {
      const coordinates = area.coordinates;
      if (coordinates) {
        coordinates.polygon = typeof updateAreaDto.coordinates.polygon === 'string'
          ? JSON.parse(updateAreaDto.coordinates.polygon) as [number, number][]
          : updateAreaDto.coordinates.polygon;
        coordinates.center = typeof updateAreaDto.coordinates.center === 'string'
          ? JSON.parse(updateAreaDto.coordinates.center) as Point
          : updateAreaDto.coordinates.center;
        coordinates.zoom = updateAreaDto.coordinates.zoom;
        
        await this.coordinateRepository.save(coordinates);
      }
    }

    if (updateAreaDto.name) area.name = updateAreaDto.name;
    if (updateAreaDto.areaName) area.areaName = updateAreaDto.areaName;
    if (updateAreaDto.landPlot) area.landPlot = updateAreaDto.landPlot;
    if (updateAreaDto.status) area.status = updateAreaDto.status;
    if (updateAreaDto.area) area.area = updateAreaDto.area;
    if (updateAreaDto.usage) area.usage = updateAreaDto.usage;
    if (updateAreaDto.classification) {
      area.classification = updateAreaDto.classification as AreaClassification;
    }

    return await this.areaRepository.save(area);
  }

  async remove(id: number): Promise<void> {
    const area = await this.findOne(id);
    const land = area.land;

    await this.areaRepository.remove(area);

    // Update land's areaCount
    if (land) {
      land.areaCount = Math.max(0, (land.areaCount || 1) - 1);
      await this.landRepository.save(land);
    }
  }
}
