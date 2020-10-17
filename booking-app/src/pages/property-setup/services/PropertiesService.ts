import axios, { AxiosResponse } from "axios";
import { PaginatedList } from "../../../models/PaginatedList";

import { Property } from "../models/Property";

export class PropertiesService {
  public get baseUrl(): string {
    return "http://localhost:8888/api";
  }

  public getProperties = async (pageSize = 10, page = 1): Promise<AxiosResponse<PaginatedList<Property>>> => {
    return await axios.get<PaginatedList<Property>>(`${this.baseUrl}/properties/list?pageSize=${pageSize}&page=${page}`);
  };
}
