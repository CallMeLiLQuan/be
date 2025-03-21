import { IsString, IsOptional, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AreaClassification } from '../enums/area-classification.enum';

export class CoordinateDto {
  @ValidateNested({ each: true })
  @Type(() => Array)
  polygon: [number, number][];

  @ValidateNested()
  @Type(() => Object)
  center: {
    lat: number;
    lng: number;
  };

  @IsNumber()
  @IsOptional()
  zoom?: number;
}

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

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