import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordinate, CoordinateDto, Point } from '../entities/region/coordinate.entity';
import { CreateCoordinateDto, UpdateCoordinateDto } from './dto/coordinate.dto';
import { Land } from 'src/entities/region/land.entity';

@Injectable()
export class CoordinateService {
  constructor(
    @InjectRepository(Coordinate)
    private coordinateRepository: Repository<Coordinate>,
    @InjectRepository(Land)
    private landRepo: Repository<Land>,
  ) {}

  async findCoordinateByLandId(landId: number): Promise<Coordinate[]> {
    const land = await this.landRepo.findOne({
      where: { id: landId },
      relations: ['coordinate']
    });
    
    if (!land) {
      throw new NotFoundException(`Land with ID ${landId} not found`);
    }

    if (!land.coordinate) {
      throw new NotFoundException(`No coordinate found for land with ID ${landId}`);
    }

    return [land.coordinate];
  }

  async findAll(): Promise<Coordinate[]> {
    return await this.coordinateRepository.find({
      relations: ['area', 'land']
    });
  }

  async findOne(id: number): Promise<Coordinate> {
    const coordinate = await this.coordinateRepository.findOne({
      where: { id },
      relations: ['area', 'land']
    });
    
    if (!coordinate) {
      throw new NotFoundException(`Coordinate with ID ${id} not found`);
    }

    return coordinate;
  }

  async create(coordinateDto: CreateCoordinateDto): Promise<Coordinate> {
    const coordinate = new Coordinate();
    
    // Directly assign the polygon array
    coordinate.polygon = coordinateDto.polygon;
    
    // Set center point
    coordinate.center = coordinateDto.center || {
      lat: coordinateDto.polygon[0][0],
      lng: coordinateDto.polygon[0][1]
    };
    
    coordinate.zoom = coordinateDto.zoom || 15;

    const saved = await this.coordinateRepository.save(coordinate);
    return saved;
  }

  async update(id: number, coordinateDto: UpdateCoordinateDto): Promise<Coordinate> {
    const coordinate = await this.findOne(id);

    if (coordinateDto.polygon) {
      coordinate.polygon = coordinateDto.polygon;
    }

    if (coordinateDto.center) {
      coordinate.center = coordinateDto.center;
    } else if (coordinateDto.polygon && coordinateDto.polygon.length > 0) {
      // Calculate center as average of all points
      const sumLat = coordinateDto.polygon.reduce((sum, [lat]) => sum + lat, 0);
      const sumLng = coordinateDto.polygon.reduce((sum, [, lng]) => sum + lng, 0);
      const count = coordinateDto.polygon.length;
      
      coordinate.center = {
        lat: sumLat / count,
        lng: sumLng / count
      };
    }

    if (coordinateDto.zoom !== undefined) {
      coordinate.zoom = coordinateDto.zoom;
    }

    const saved = await this.coordinateRepository.save(coordinate);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const coordinate = await this.findOne(id);
    await this.coordinateRepository.remove(coordinate);
  }

  toDto(coordinate: Coordinate): CoordinateDto {
    return {
      polygon: coordinate.polygon,
      center: coordinate.center,
      zoom: coordinate.zoom
    };
  }
}
