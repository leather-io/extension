export interface Paginated<T> {
  limit: number;
  offset: number;
  total: number;
  results: T;
}
