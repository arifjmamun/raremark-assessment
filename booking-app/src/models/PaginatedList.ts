export interface PaginatedList<T = any> {
  count: number;
  items: T[];
}