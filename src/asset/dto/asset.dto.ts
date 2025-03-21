import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class WateringSchedule {
  @IsString()
  frequency: 'daily' | 'weekly' | 'monthly';

  @IsNumber()
  amount: number;

  @IsString()
  description: string;
}

class PlantInfo {
  @IsNumber()
  age: number;

  @ValidateNested()
  @Type(() => WateringSchedule)
  wateringSchedule: WateringSchedule;
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
  properties?: Record<string, any>[];

  @IsOptional()
  @IsNumber()
  landId?: number;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlantInfo)
  plantInfo?: PlantInfo;

  @IsString()
  landName: string;

  @IsString()
  areaName: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateAssetDto extends CreateAssetDto {
  @IsOptional()
  name: string;

  @IsOptional()
  type: string;

  @IsOptional()
  quantity: number;

  @IsOptional()
  landName: string;

  @IsOptional()
  areaName: string;

  @IsOptional()
  @IsString()
  category?: string;
}