import { IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';

import { PropertyType } from '../types/property-type.enum';

export class UpdatePropertyDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  title?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional()
  country?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  fromDate?: Date;

  @IsOptional()
  toDate?: Date;
}
