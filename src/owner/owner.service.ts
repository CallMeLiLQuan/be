import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../entities/region/owner.entity';
import { CreateOwnerDto, UpdateOwnerDto } from './dto/owner.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>
  ) {}

  async findAll(): Promise<Owner[]> {
    return await this.ownerRepository.find({
      relations: ['lands']
    });
  }

  async findOne(id: number): Promise<Owner> {
    const owner = await this.ownerRepository.findOne({
      where: { id },
      relations: ['lands']
    });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return owner;
  }

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownerRepository.create({
      ...createOwnerDto,
      landCount: 0
    });
    return await this.ownerRepository.save(owner);
  }

  async update(id: number, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    const owner = await this.findOne(id);
    
    const currentLandCount = owner.lands ? owner.lands.length : 0;
    
    Object.assign(owner, {
      ...updateOwnerDto,
      landCount: currentLandCount
    });
    
    return await this.ownerRepository.save(owner);
  }

  async remove(id: number): Promise<void> {
    const owner = await this.findOne(id);
    await this.ownerRepository.remove(owner);
  }
  
  async refreshLandCount(id: number): Promise<Owner> {
    const owner = await this.findOne(id);
    const actualLandCount = owner.lands ? owner.lands.length : 0;
    
    if (owner.landCount !== actualLandCount) {
      owner.landCount = actualLandCount;
      return await this.ownerRepository.save(owner);
    }
    
    return owner;
  }
}
