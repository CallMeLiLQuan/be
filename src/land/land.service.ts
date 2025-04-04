import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Land } from '../entities/region/land.entity';
import { Coordinate } from '../entities/region/coordinate.entity';
import { Owner } from '../entities/region/owner.entity';
import { Region } from '../entities/region/region.entity';
import { CreateLandDto, UpdateLandDto } from './dto/creatLandDto';

@Injectable()
export class LandService {
  constructor(
    @InjectRepository(Land)
    private landRepository: Repository<Land>,
    @InjectRepository(Coordinate)
    private coordinateRepository: Repository<Coordinate>,
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
    @InjectRepository(Region)
    private regionRepository: Repository<Region>
  ) {}

  async findAll(): Promise<Land[]> {
    return await this.landRepository.find({
      relations: ['owner', 'areas', 'coordinate', 'region']
    });
  }

  async findOne(id: number): Promise<Land> {
    const land = await this.landRepository.findOne({
      where: { id },
      relations: ['owner', 'areas', 'coordinate', 'region']
    });
    if (!land) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }
    return land;
  }

  async create(createLandDto: CreateLandDto): Promise<Land> {
    try {
      // Find owner
      const owner = await this.ownerRepository.findOne({
        where: { id: createLandDto.ownerId }
      });
      if (!owner) {
        throw new NotFoundException(`Owner with ID ${createLandDto.ownerId} not found`);
      }

      // Find region
      const region = await this.regionRepository.findOne({
        where: { id: createLandDto.regionId }
      });
      if (!region) {
        throw new NotFoundException(`Region with ID ${createLandDto.regionId} not found`);
      }

      // Create coordinate
      const coordinate = this.coordinateRepository.create({
        polygon: JSON.parse(createLandDto.coordinate.polygon),
        center: JSON.parse(createLandDto.coordinate.center),
        zoom: createLandDto.coordinate.zoom
      });
      await this.coordinateRepository.save(coordinate);

      // Create land
      const land = this.landRepository.create({
        name: createLandDto.name,
        address: createLandDto.address,
        area: createLandDto.area,
        price: createLandDto.price,
        location: createLandDto.location,
        areaCount: 0,
        properties: createLandDto.properties || [],
        coordinate: coordinate,
        owner: owner,
        region: region,
        planningMapUrl: createLandDto.planningMapUrl || '',
        googleMapUrl: createLandDto.googleMapUrl || '',
        areas: []
      });

      const savedLand = await this.landRepository.save(land);
      
      // Update owner's landCount
      owner.landCount = (owner.landCount || 0) + 1;
      await this.ownerRepository.save(owner);

      return savedLand;
    } catch (error) {
      // If there's an error, clean up the coordinate if it was created
      if (error.coordinate?.id) {
        await this.coordinateRepository.remove(error.coordinate);
      }
      console.error('Error creating land:', error);
      throw error;
    }
  }

  async update(id: number, updateLandDto: UpdateLandDto): Promise<Land> {
    const land = await this.findOne(id);

    if (updateLandDto.ownerId && updateLandDto.ownerId !== land.owner.id) {
      const newOwner = await this.ownerRepository.findOne({
        where: { id: updateLandDto.ownerId }
      });
      if (!newOwner) {
        throw new NotFoundException(`Owner with ID ${updateLandDto.ownerId} not found`);
      }
      // Update old owner's landCount
      if (land.owner) {
        land.owner.landCount = Math.max(0, (land.owner.landCount || 1) - 1);
        await this.ownerRepository.save(land.owner);
      }
      // Update new owner's landCount
      newOwner.landCount = (newOwner.landCount || 0) + 1;
      await this.ownerRepository.save(newOwner);
      land.owner = newOwner;
    }

    if (updateLandDto.regionId && updateLandDto.regionId !== land.region.id) {
      const newRegion = await this.regionRepository.findOne({
        where: { id: updateLandDto.regionId }
      });
      if (!newRegion) {
        throw new NotFoundException(`Region with ID ${updateLandDto.regionId} not found`);
      }
      land.region = newRegion;
    }

    if (updateLandDto.coordinate) {
      const coordinate = await this.coordinateRepository.preload({
        id: land.coordinate.id,
        polygon: JSON.parse(updateLandDto.coordinate.polygon),
        center: JSON.parse(updateLandDto.coordinate.center),
        zoom: updateLandDto.coordinate.zoom
      });
      await this.coordinateRepository.save(coordinate);
      land.coordinate = coordinate;
    }

    Object.assign(land, {
      name: updateLandDto.name ?? land.name,
      address: updateLandDto.address ?? land.address,
      area: updateLandDto.area ?? land.area,
      price: updateLandDto.price ?? land.price,
      location: updateLandDto.location ?? land.location,
      properties: updateLandDto.properties ?? land.properties,
      planningMapUrl: updateLandDto.planningMapUrl ?? land.planningMapUrl,
      googleMapUrl: updateLandDto.googleMapUrl ?? land.googleMapUrl
    });

    return await this.landRepository.save(land);
  }

  async remove(id: number): Promise<void> {
    const land = await this.findOne(id);
    if (land.owner) {
      land.owner.landCount = Math.max(0, (land.owner.landCount || 1) - 1);
      await this.ownerRepository.save(land.owner);
    }
    await this.landRepository.remove(land);
  }
}
