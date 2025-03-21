import { IsArray, IsNumber, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Point } from 'src/entities/region/coordinate.entity';

export class CenterPointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateCoordinateDto {
  @IsArray()
  polygon: [number, number][];

  @IsObject()
  @ValidateNested()
  @Type(() => CenterPointDto)
  center: CenterPointDto;

  @IsNumber()
  @IsOptional()
  zoom?: number;
}

export class UpdateCoordinateDto {
  @IsArray()
  @IsOptional()
  polygon?: [number, number][];

  @IsObject()
  @ValidateNested()
  @Type(() => CenterPointDto)
  @IsOptional()
  center?: CenterPointDto;

  @IsNumber()
  @IsOptional()
  zoom?: number;
}

// Response DTO for consistent API responses
export class CoordinateResponseDto {
  id: number;
  polygon: [number, number][];
  center: CenterPointDto;
  zoom: number;
}
