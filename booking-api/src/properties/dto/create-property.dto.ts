import { IsNotEmpty, IsEnum, IsNumberString } from 'class-validator';

import { PropertyType } from "../types/property-type.enum";

export class CreatePropertyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(PropertyType)
  type: PropertyType;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  fromDate: Date;

  @IsNotEmpty()
  toDate: Date;
}