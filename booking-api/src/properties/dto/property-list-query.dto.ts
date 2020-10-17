import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';
import { PropertyType } from '../types/property-type.enum';

export class PropertyListQueryDto {
  @IsOptional()
  @IsNumberString()
  pageSize?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;
}
