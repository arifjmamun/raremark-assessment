import axios, { AxiosResponse } from "axios";

import { PaginatedList } from "../models/PaginatedList";
import { Property } from "../pages/property-setup/models/Property";
import { LandingPageItem } from "../pages/home/models/LandingPageItem";

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
    return "http://localhost:8888/api";
  }

  public getProperties = async (pageSize = 10, page = 1, queryParams: any = {}): Promise<AxiosResponse<PaginatedList<Property>>> => {
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
}
