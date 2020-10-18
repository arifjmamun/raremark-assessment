import axios, { AxiosResponse } from 'axios';

import { PaginatedList } from '../models/PaginatedList';
import { Property } from '../pages/property-setup/models/Property';
import { LandingPageItem } from '../pages/home/models/LandingPageItem';
import { CreateProperty } from './../pages/property-setup/models/CreateProperty';

export class PropertiesService {
  private constructor() {}

  private static instance: PropertiesService;

  public static getInstance(): PropertiesService {
    if (PropertiesService.instance) {
      return PropertiesService.instance;
    }
    PropertiesService.instance = new PropertiesService();
    return PropertiesService.instance;
  }

  public get baseUrl(): string {
    return 'http://localhost:8888/api';
  }

  public getProperties = async (
    pageSize = 10,
    page = 1,
    queryParams: any = {}
  ): Promise<AxiosResponse<PaginatedList<Property>>> => {
    queryParams = {
      ...queryParams,
      pageSize,
      page
    };
    return await axios.get<PaginatedList<Property>>(`${this.baseUrl}/properties/list`, { params: queryParams });
  };

  public getMockApiData = async (): Promise<AxiosResponse<LandingPageItem[]>> => {
    return await axios.get<LandingPageItem[]>(`${this.baseUrl}/properties/home`);
  };

  public addProperty = async (
    payload: CreateProperty,
    files: File[],
    fileKey = 'files'
  ): Promise<AxiosResponse<Property>> => {
    const formData: FormData = new FormData();
    if (payload) {
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });
      files.forEach((file) => {
        formData.append(fileKey, file, file.name);
      });
    }

    return await axios.post<Property>(`${this.baseUrl}/properties`, formData);
  };
}
