import { IsString, IsOptional, IsNumber, ValidateNested, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AreaClassification } from '../enums/area-classification.enum';

export class CoordinateDto {
  @IsOptional()
  @IsArray()
  polygon: [number, number][] | string;

  @IsOptional()
  center: { lat: number; lng: number } | string;

  @IsNumber()
  @IsOptional()
  zoom?: number;
}

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsString()
  areaName: string;

  @IsString()
  @IsOptional()
  landPlot?: string;

  @IsString()
  @IsEnum(['available', 'in-use', 'pending'])
  status: 'available' | 'in-use' | 'pending';

  @IsNumber()
  area: number;

  @IsString()
  usage: string;

  @IsEnum(AreaClassification)
  classification: AreaClassification;

  @ValidateNested()
  @Type(() => CoordinateDto)
  @IsOptional()
  coordinates?: CoordinateDto;

  @IsNumber()
  landId: number;
}

export class UpdateAreaDto extends CreateAreaDto {}