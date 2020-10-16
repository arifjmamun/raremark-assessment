import { PropertyListQueryDto } from './dto/property-list-query.dto';
import {
  Body,
  UploadedFiles,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@UploadedFiles() files: UploadFile[], @Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertiesService.create(files, createPropertyDto);
  }

  @Get()
  async findAll(@Query() query: PropertyListQueryDto): Promise<PaginatedList<Property> | HttpException> {
    try {
      const pageSize = parseInt(query.pageSize) || 4;
      const page = parseInt(query.page) || 1;
      const { fromDate, toDate, searchTerm } = query;

      const propertyList = await this.propertiesService.findAll(pageSize, page, fromDate, toDate, searchTerm);
      return propertyList;
    } catch (error) {
      console.log(error);
      return new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.propertiesService.remove(id);
  }
}
