import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateOwnerDto } from 'src/owner/dto/owner.dto';
import { CreateCoordinateDto } from 'src/coordinate/dto/coordinate.dto';
import { CreateRegionDto } from 'src/region/dto/region.dto';

export class CreateLandDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  area: number;

  @IsNumber()
  price: number;

  @IsString()
  location: string;

  @IsNumber()
  areaCount: number;

  @IsOptional()
  @IsArray()
  properties?: { key: string; value: string | number | boolean }[];

  @ValidateNested()
  @Type(() => CreateCoordinateDto)
  coordinate: CreateCoordinateDto;

  @ValidateNested()
  @Type(() => CreateOwnerDto)
  owner: CreateOwnerDto;

  @ValidateNested()
  @Type(() => CreateRegionDto)
  region: CreateRegionDto;

  @IsOptional()
  @IsString()
  planningMapUrl?: string;

  @IsOptional()
  @IsString()
  googleMapUrl?: string;
}

export class UpdateLandDto extends CreateLandDto {
  @IsOptional()
  name: string;

  @IsOptional()
  address: string;

  @IsOptional()
  area: number;

  @IsOptional()
  price: number;

  @IsOptional()
  location: string;

  @IsOptional()
  areaCount: number;
}