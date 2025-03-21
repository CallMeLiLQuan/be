import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  properties?: Record<string, any>[];
}

export class UpdateRegionDto extends CreateRegionDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;
}