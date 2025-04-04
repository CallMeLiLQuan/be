import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class PropertyDto {
  @IsString()
  key: string;

  @IsOptional()
  value: string | number | boolean;
}

class PlantInfoDto {
  @IsString()
  growthStage: string;

  @IsDateString()
  lastWatered: string;

  @IsString()
  fertilizerUsed: string;
}

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  properties?: PropertyDto[];

  @IsOptional()
  @IsNumber()
  landId?: number;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlantInfoDto)
  plantInfo?: PlantInfoDto;

  @IsOptional()
  @IsString()
  landName?: string;

  @IsOptional()
  @IsString()
  areaName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateAssetDto extends CreateAssetDto {}