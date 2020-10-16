import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindConditions, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './property.entity';
import { UploadFile } from './types/upload-file.model';
import { EDateType, LessThanOrEqualDate, MoreThanOrEqualDate } from '../common/utils/datetime.util';
import { PaginatedList } from '../common/models/paginated-list.model';
import { format } from 'date-fns';

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
        fromDate: new Date(`${createPropertyDto.fromDate}T00:00:00Z`),
        toDate: new Date(`${createPropertyDto.fromDate}T23:59:59Z`),
        images: images,
        price: parseFloat(createPropertyDto.price)
      };

      return await this.propertiesRepository.save(property);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(
    pageSize = 4,
    page = 1,
    fromDate?: string,
    toDate?: string,
    searchTerm?: string
  ): Promise<PaginatedList<Property>> {
    const conditions: FindConditions<Property>[] = [];

    if (searchTerm) {
      searchTerm = `%${searchTerm}%`;
      conditions.push(...[{ country: Like(searchTerm) }, { city: Like(searchTerm) }]);
    }

    if (fromDate && toDate) {
      const rangeFrom = new Date(new Date(fromDate).setHours(0, 0, 0));
      const rangeTo = new Date(new Date(toDate).setHours(23, 59, 59));
      const dateRangeCndition: FindConditions<Property> = {
        fromDate: MoreThanOrEqualDate(rangeFrom, EDateType.Datetime),
        toDate: LessThanOrEqualDate(rangeTo, EDateType.Datetime)
      };
      conditions.push(dateRangeCndition);
    }

    const [properties, count] = await this.propertiesRepository.findAndCount({
      where: conditions,
      skip: pageSize * (page - 1),
      take: pageSize
    });

    return PaginatedList.create<Property>(count, properties);
  }

  findOne(id: string): Promise<Property> {
    return this.propertiesRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.propertiesRepository.delete(id);
  }
}
