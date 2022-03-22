export interface PaginatedResults<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}
