import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCoordinateDto {
  @IsString()
  polygon: string; // JSON string of coordinates

  @IsString()
  center: string; // JSON string of center point

  @IsNumber()
  zoom: number;
}

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

  @IsOptional()
  @IsArray()
  properties?: { key: string; value: string | number | boolean }[];

  @ValidateNested()
  @Type(() => CreateCoordinateDto)
  coordinate: CreateCoordinateDto;

  @IsNumber()
  ownerId: number;

  @IsNumber()
  regionId: number;

  @IsOptional()
  @IsString()
  planningMapUrl?: string;

  @IsOptional()
  @IsString()
  googleMapUrl?: string;
}
