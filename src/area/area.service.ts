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
    const land = await this.landRepository.findOne({ 
      where: { id: landId },
      relations: ['coordinate'] 
    });
    if (!land) {
      throw new NotFoundException(`Land with ID ${landId} not found`);
    }

    // Create coordinates using land's coordinates as default if not provided
    let coordinates = new Coordinate();
    if (coordinatesDto) {
      try {
        // Parse JSON strings if they are strings
        const polygon = typeof coordinatesDto.polygon === 'string' 
          ? JSON.parse(coordinatesDto.polygon)
          : coordinatesDto.polygon;

        const center = typeof coordinatesDto.center === 'string'
          ? JSON.parse(coordinatesDto.center)
          : coordinatesDto.center;

        // Validate polygon data
        if (!Array.isArray(polygon)) {
          throw new Error('Polygon must be an array of coordinates');
        }

        coordinates.polygon = polygon;
        coordinates.center = center;
        coordinates.zoom = coordinatesDto.zoom || 15;
      } catch (error) {
        console.error('Error processing coordinates:', error);
        throw new Error('Invalid coordinate format');
      }
    } else if (land.coordinate) {
      // Use land's coordinates as default
      coordinates.polygon = land.coordinate.polygon;
      coordinates.center = land.coordinate.center;
      coordinates.zoom = land.coordinate.zoom;
    } else {
      // Set default coordinates if neither provided nor available from land
      coordinates.polygon = [[21.0235276, 105.8420103]];
      coordinates.center = { lat: 21.0235276, lng: 105.8420103 };
      coordinates.zoom = 15;
    }

    // Save coordinates first
    const savedCoordinates = await this.coordinateRepository.save(coordinates);

    // Create and save area
    const area = this.areaRepository.create({
      ...areaData,
      land,
      coordinates: savedCoordinates
    });

    const savedArea = await this.areaRepository.save(area);
    console.log('Saved area with coordinates:', JSON.stringify(savedArea, null, 2));
    
    return savedArea;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const { coordinates: coordinatesDto, landId, ...areaData } = updateAreaDto;
    
    // Find existing area
    const existingArea = await this.areaRepository.findOne({
      where: { id },
      relations: ['land', 'coordinates']
    });

    if (!existingArea) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }

    // Update land if landId is provided
    if (landId) {
      const land = await this.landRepository.findOne({ 
        where: { id: landId },
        relations: ['coordinate'] 
      });
      if (!land) {
        throw new NotFoundException(`Land with ID ${landId} not found`);
      }
      existingArea.land = land;
    }

    // Update coordinates if provided
    if (coordinatesDto) {
      try {
        // Parse JSON strings if they are strings
        const polygon = typeof coordinatesDto.polygon === 'string' 
          ? JSON.parse(coordinatesDto.polygon)
          : coordinatesDto.polygon;

        const center = typeof coordinatesDto.center === 'string'
          ? JSON.parse(coordinatesDto.center)
          : coordinatesDto.center;

        // Validate polygon data
        if (!Array.isArray(polygon)) {
          throw new Error('Polygon must be an array of coordinates');
        }

        // Update existing coordinates
        if (existingArea.coordinates) {
          existingArea.coordinates.polygon = polygon;
          existingArea.coordinates.center = center;
          existingArea.coordinates.zoom = coordinatesDto.zoom || existingArea.coordinates.zoom;
          await this.coordinateRepository.save(existingArea.coordinates);
        } else {
          // Create new coordinates if none exist
          const coordinates = new Coordinate();
          coordinates.polygon = polygon;
          coordinates.center = center;
          coordinates.zoom = coordinatesDto.zoom || 15;
          const savedCoordinates = await this.coordinateRepository.save(coordinates);
          existingArea.coordinates = savedCoordinates;
        }
      } catch (error) {
        console.error('Error processing coordinates:', error);
        throw new Error('Invalid coordinate format');
      }
    }

    // Update other area data
    Object.assign(existingArea, areaData);

    // Save and return updated area
    const savedArea = await this.areaRepository.save(existingArea);
    console.log('Updated area with coordinates:', JSON.stringify(savedArea, null, 2));
    
    return savedArea;
  }

  async remove(id: number): Promise<void> {
    const area = await this.findOne(id);
    await this.areaRepository.remove(area);
  }
}
