import {
  type QueryObserverSuccessResult,
  UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

type AllowedReactQueryConfigOptions = keyof Pick<
  UseQueryOptions,
  'select' | 'initialData' | 'onSuccess' | 'onSettled' | 'onError' | 'suspense'
>;

export type AppUseQueryConfig<QueryFnData, Response> = Pick<
  UseQueryOptions<QueryFnData, unknown, Response>,
  AllowedReactQueryConfigOptions
>;

export function isFetchedWithSuccess<TData, TError = unknown>(
  query: UseQueryResult<TData, TError>
): query is QueryObserverSuccessResult<TData, TError> {
  return !query.isError && !query.isLoading && query.data !== undefined;
}
