import { PropertyListQueryDto } from './dto/property-list-query.dto';
import {
  Body,
  UploadedFiles,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  Query,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { Property } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertiesService } from './properties.service';
import { UploadFile } from './types/upload-file.model';
import { PaginatedList } from '../common/models/paginated-list.model';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { LandingPageItem } from './types/landing-page-item.model';

@Controller('api/properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(@UploadedFiles() files: UploadFile[], @Body() createPropertyDto: CreatePropertyDto): Promise<Property | HttpException> {
    try {
      return await this.propertiesService.create(files, createPropertyDto);      
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('list')
  async findAll(@Query() query: PropertyListQueryDto): Promise<PaginatedList<Property> | HttpException> {
    try {
      const pageSize = parseInt(query.pageSize) || 4;
      const page = parseInt(query.page) || 1;
      const { fromDate, toDate, searchTerm } = query;

      const propertyList = await this.propertiesService.findAll(pageSize, page, fromDate, toDate, searchTerm);
      return propertyList;
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('home')
  getLandingPageMockData(): Promise<LandingPageItem[]> {
    return this.propertiesService.getLandingPageMockData();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Property> {
    try {
      return await this.propertiesService.findOne(parseInt(id));
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto): Promise<Property | HttpException> {
    try {
      return await this.propertiesService.updateOne(parseInt(id), updatePropertyDto);      
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.propertiesService.remove(id);
  }
}
