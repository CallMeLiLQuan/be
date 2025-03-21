import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsNumber()
  landCount: number;

  @IsOptional()
  @IsArray()
  properties?: { key: string; value: string | number | boolean }[];
}

export class UpdateOwnerDto extends CreateOwnerDto {
  @IsOptional()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  landCount: number;
}