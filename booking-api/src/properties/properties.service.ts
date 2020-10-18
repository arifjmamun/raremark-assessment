import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindConditions } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './property.entity';
import { UploadFile } from './types/upload-file.model';
import { EDateType, LessThanOrEqualDate, MoreThanOrEqualDate } from '../common/utils/datetime.util';
import { PaginatedList } from '../common/models/paginated-list.model';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { landingPageMock } from './mock-data/landing-page.data';
import { LandingPageItem } from './types/landing-page-item.model';
import { PropertyType } from './types/property-type.enum';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>
  ) {}

  async create(files: UploadFile[], createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const rangeFrom = new Date(`${createPropertyDto.fromDate}T00:00:00Z`);
      const rangeTo = new Date(`${createPropertyDto.toDate}T23:59:59Z`);

      if (rangeFrom > rangeTo) {
        throw new Error('Invalid date range');
      }

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
          const fileName = file.originalname.replace('-', '_');
          fs.writeFile(join(subDirPath, fileName), file.buffer, error => {
            if (error) {
              reject(error);
            }
            resolve(`/${subDir}/${fileName}`);
          });
        });
        images.push(filePath);
      }

      let property = new Property();
      property = {
        ...property,
        ...createPropertyDto,
        fromDate: rangeFrom,
        toDate: rangeTo,
        images: images,
        price: parseFloat(createPropertyDto.price)
      };

      return await this.propertiesRepository.save(property);
    } catch (error) {
      throw error;
    }
  }

  getLandingPageMockData(): Promise<LandingPageItem[]> {
    return Promise.resolve(landingPageMock);
  }

  async findAll(
    pageSize = 4,
    page = 1,
    fromDate?: string,
    toDate?: string,
    searchTerm?: string,
    type?: PropertyType
  ): Promise<PaginatedList<Property>> {
    try {
      const conditions: FindConditions<Property>[] = [];

      if (searchTerm) {
        searchTerm = `%${searchTerm}%`;
        conditions.push(...[
          { country: Like(searchTerm) }, 
          { city: Like(searchTerm) },
          { description: Like(searchTerm) },
          { title: Like(searchTerm) }
        ]);
      }

      if (fromDate && toDate) {
        const rangeFrom = new Date(new Date(fromDate).setHours(0, 0, 0));
        const rangeTo = new Date(new Date(toDate).setHours(23, 59, 59));
        if (rangeFrom > rangeTo) {
          throw new Error('Invalid date range');
        }
        const dateRangeCndition: FindConditions<Property> = {
          fromDate: MoreThanOrEqualDate(rangeFrom, EDateType.Datetime),
          toDate: LessThanOrEqualDate(rangeTo, EDateType.Datetime)
        };
        conditions.push(dateRangeCndition);
      }

      if (type) {
        const typeCndition: FindConditions<Property> = { type };
        conditions.push(typeCndition);
      }

      const [properties, count] = await this.propertiesRepository.findAndCount({
        where: conditions,
        skip: pageSize * (page - 1),
        take: pageSize,
        order: { id: 'DESC' }
      });

      return PaginatedList.create<Property>(count, properties);
    } catch (error) {
      throw error;
    }
  }

  async updateOne(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    try {
      if (id !== updatePropertyDto.id) {
        throw new Error('Invalid ID');
      }
      let property = await this.propertiesRepository.findOne(id);

      if (!property) {
        throw new Error('Property not found!');
      }

      property = {
        ...property,
        ...updatePropertyDto
      };

      const { fromDate, toDate } = updatePropertyDto;

      if (fromDate && toDate) {
        const rangeFrom = new Date(new Date(fromDate).setHours(0, 0, 0));
        const rangeTo = new Date(new Date(toDate).setHours(23, 59, 59));
        if (rangeFrom > rangeTo) {
          throw new Error('Invalid date range');
        }
        property = {
          ...property,
          fromDate: rangeFrom,
          toDate: rangeTo
        };
      }

      return await this.propertiesRepository.save(property);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertiesRepository.findOne(id);
    if (!property) {
      throw new Error('Property not found!');
    }
    return property;
  }

  async remove(id: number): Promise<void> {
    await this.propertiesRepository.delete(id);
  }
}
