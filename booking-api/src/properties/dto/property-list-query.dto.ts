import { IsOptional, IsString, IsNumberString, IsBooleanString,  } from "class-validator";

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
}