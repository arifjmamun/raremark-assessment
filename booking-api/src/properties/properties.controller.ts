import { Body, UploadedFiles, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { Property } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertiesService } from './properties.service';
import { UploadFile } from './types/upload-file.model';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@UploadedFiles() files: UploadFile[], @Body() createPropertyDto: CreatePropertyDto): Promise<Property> {

    files.forEach((file) => {
      console.log(file);
      console.log(typeof file.buffer);
    });

    // console.log('files', files);
    console.log('createPropertyDto', createPropertyDto);

    // return Promise.resolve(new Property());
    return this.propertiesService.create(files, createPropertyDto);
  }

  @Get()
  findAll(): Promise<Property[]> {
    return this.propertiesService.findAll();
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