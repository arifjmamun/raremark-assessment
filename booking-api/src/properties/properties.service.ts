import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './property.entity';
import { UploadFile } from './types/upload-file.model';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>
  ) {}

  async create(files: UploadFile[], createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const basePath = '../../uploads';
      const images: string[] = [];

      const dirPath = join(__dirname, basePath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }

      const subDir = Date.now().toString();
      const subDirPath = join(__dirname, basePath, subDir);

      if (!fs.existsSync(subDirPath)) {
        fs.mkdirSync(subDirPath);
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const filePath = await new Promise<string>((resolve, reject) => {
          fs.writeFile(join(subDirPath, file.originalname.replace('-', '_')), file.buffer, error => {
            if (error) {
              reject(error);
            }
            resolve(`/${subDir}/${file.originalname}`);
          });
        });
        images.push(filePath);
      }

      let property = new Property();
      property = {
        ...property,
        ...createPropertyDto,
        images: images
      };

      return await this.propertiesRepository.save(property);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<Property[]> {
    return this.propertiesRepository.find();
  }

  findOne(id: string): Promise<Property> {
    return this.propertiesRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.propertiesRepository.delete(id);
  }
}
