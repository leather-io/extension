// TODO: clarify usage of password for local key encryption
export const DEFAULT_PASSWORD = 'password';

export interface PaginatedResults<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}
