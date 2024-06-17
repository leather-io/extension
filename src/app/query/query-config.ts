import { type QueryObserverSuccessResult, type UseQueryResult } from '@tanstack/react-query';

// TODO #40: Import from query pkg and remove
export function isFetchedWithSuccess<TData, TError = unknown>(
  query: UseQueryResult<TData, TError>
): query is QueryObserverSuccessResult<TData, TError> {
  return !query.isError && !query.isLoading && query.data !== undefined;
}
