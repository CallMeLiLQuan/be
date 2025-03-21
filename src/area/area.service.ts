import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../entities/region/area.entity';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';
import { Coordinate } from '../entities/region/coordinate.entity';
import { Land } from '../entities/region/land.entity';

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
    const areas = await this.areaRepository.find({
      relations: ['land', 'coordinates', 'employees', 'assets']
    });

    // Parse stored JSON strings back to objects for each area
    return areas.map(area => {
      if (area.coordinates) {
        try {
          const coordinates = area.coordinates;
          coordinates.polygon = coordinates.polygon || [];
          coordinates.center = coordinates.center || { lat: 0, lng: 0 };
        } catch (error) {
          console.error('Error parsing coordinates for area', area.id, ':', error);
        }
      }
      return area;
    });
  }

  async findOne(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['land', 'coordinates', 'employees', 'assets']
    });
    
    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }

    // Parse stored JSON strings back to objects
    if (area.coordinates) {
      try {
        const coordinates = area.coordinates;
        coordinates.polygon = coordinates.polygon || [];
        coordinates.center = coordinates.center || { lat: 0, lng: 0 };
      } catch (error) {
        console.error('Error parsing coordinates:', error);
      }
    }
    
    return area;
  }

  async findByLand(landId: number): Promise<Area[]> {
    return await this.areaRepository.find({
      where: { land: { id: landId } },
      relations: ['land', 'coordinates', 'employees', 'assets']
    });
  }

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const { coordinates: coordinatesDto, landId, ...areaData } = createAreaDto;

    // Find the land
    const land = await this.landRepository.findOne({ where: { id: landId } });
    if (!land) {
      throw new NotFoundException(`Land with ID ${landId} not found`);
    }

    // Create and save coordinates if provided
    let coordinates = null;
    if (coordinatesDto) {
      console.log('Received coordinates:', JSON.stringify(coordinatesDto, null, 2));
      
      // Ensure polygon data is valid
      if (!Array.isArray(coordinatesDto.polygon)) {
        throw new Error('Polygon must be an array of coordinates');
      }

      coordinates = new Coordinate();
      coordinates.polygon = coordinatesDto.polygon;
      coordinates.center = coordinatesDto.center || { lat: 0, lng: 0 };
      coordinates.zoom = coordinatesDto.zoom || 15;

      console.log('Saving coordinates:', JSON.stringify(coordinates, null, 2));
      await this.coordinateRepository.save(coordinates);
    }

    // Create and save area
    const area = this.areaRepository.create({
      ...areaData,
      land,
      coordinates
    });

    const savedArea = await this.areaRepository.save(area);
    console.log('Saved area with coordinates:', JSON.stringify(savedArea, null, 2));
    
    return savedArea;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const area = await this.findOne(id);
    Object.assign(area, updateAreaDto);
    return await this.areaRepository.save(area);
  }

  async remove(id: number): Promise<void> {
    const area = await this.findOne(id);
    await this.areaRepository.remove(area);
  }
}
