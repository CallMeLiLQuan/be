import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../entities/region/asset.entity';
import { Land } from '../entities/region/land.entity';
import { Area } from '../entities/region/area.entity';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(Land)
    private landRepository: Repository<Land>,
    @InjectRepository(Area)
    private areaRepository: Repository<Area>
  ) {}

  async findAll(): Promise<Asset[]> {
    return await this.assetRepository.find({
      relations: ['land', 'area', 'area.land']
    });
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: ['land', 'area', 'area.land']
    });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async findByArea(areaId: number): Promise<Asset[]> {
    return await this.assetRepository.find({
      where: { areaId },
      relations: ['land', 'area', 'area.land']
    });
  }

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    // Validate and get land
    let land = null;
    if (createAssetDto.landId) {
      land = await this.landRepository.findOne({
        where: { id: createAssetDto.landId }
      });
      if (!land) {
        throw new NotFoundException(`Land with ID ${createAssetDto.landId} not found`);
      }
    }

    // Validate and get area
    let area = null;
    if (createAssetDto.areaId) {
      area = await this.areaRepository.findOne({
        where: { id: createAssetDto.areaId },
        relations: ['land']
      });
      if (!area) {
        throw new NotFoundException(`Area with ID ${createAssetDto.areaId} not found`);
      }

      // Verify area belongs to the specified land
      if (land && area.land.id !== land.id) {
        throw new BadRequestException(`Area ${createAssetDto.areaId} does not belong to Land ${createAssetDto.landId}`);
      }
    }

    // Create the asset
    const asset = this.assetRepository.create({
      ...createAssetDto,
      land,
      area,
      properties: createAssetDto.properties || [],
      plantInfo: createAssetDto.plantInfo || null
    });

    return await this.assetRepository.save(asset);
  }

  async update(id: number, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.findOne(id);
    
    // Validate and update land if specified
    if (updateAssetDto.landId) {
      const land = await this.landRepository.findOne({
        where: { id: updateAssetDto.landId }
      });
      if (!land) {
        throw new NotFoundException(`Land with ID ${updateAssetDto.landId} not found`);
      }
      asset.land = land;
    }

    // Validate and update area if specified
    if (updateAssetDto.areaId) {
      const area = await this.areaRepository.findOne({
        where: { id: updateAssetDto.areaId },
        relations: ['land']
      });
      if (!area) {
        throw new NotFoundException(`Area with ID ${updateAssetDto.areaId} not found`);
      }
      
      // Verify area belongs to the specified land
      if (asset.land && area.land.id !== asset.land.id) {
        throw new BadRequestException(`Area ${updateAssetDto.areaId} does not belong to Land ${asset.land.id}`);
      }
      asset.area = area;
    }

    Object.assign(asset, updateAssetDto);
    return await this.assetRepository.save(asset);
  }

  async remove(id: number): Promise<void> {
    const asset = await this.findOne(id);
    await this.assetRepository.remove(asset);
  }

  async findByCategory(category: string): Promise<Asset[]> {
    return await this.assetRepository.find({
      where: { category },
      relations: ['land', 'area', 'area.land']
    });
  }
}
