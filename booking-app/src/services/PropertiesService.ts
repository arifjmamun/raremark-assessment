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

  public getProperties = async (pageSize = 10, page = 1): Promise<AxiosResponse<PaginatedList<Property>>> => {
    return await axios.get<PaginatedList<Property>>(`${this.baseUrl}/properties/list?pageSize=${pageSize}&page=${page}`);
  };

  public getMockApiData = async (): Promise<AxiosResponse<LandingPageItem[]>> => {
    return await axios.get<LandingPageItem[]>(`${this.baseUrl}/properties/home`);
  };
}
