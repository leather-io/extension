import { UseQueryOptions } from '@tanstack/react-query';

type AllowedReactQueryConfigOptions = keyof Pick<
  UseQueryOptions,
  'select' | 'initialData' | 'onSuccess' | 'onSettled' | 'onError' | 'suspense'
>;

export type AppUseQueryConfig<QueryFnData, Response> = Pick<
  UseQueryOptions<QueryFnData, unknown, Response>,
  AllowedReactQueryConfigOptions
>;

export const HIRO_INSCRIPTIONS_API_URL = 'https://api.hiro.so/ordinals/v1/inscriptions';
