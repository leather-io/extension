import { useQuery } from '@tanstack/react-query';

import { Paginated } from '@shared/models/api-types';
import { Inscription } from '@shared/models/inscription.model';

import { AppUseQueryConfig } from '@app/query/query-config';

const inscriptionQueryOptions = {
  staleTime: Infinity,
  cacheTime: Infinity,
} as const;

function fetchInscriptionByParam() {
  return async (param: string) => {
    const res = await fetch(`https://api.hiro.so/ordinals/v1/inscriptions?${param}`);
    if (!res.ok) throw new Error('Error retrieving inscription metadata');
    const data = await res.json();
    return data as Paginated<Inscription[]>;
  };
}

type FetchInscriptionResp = Awaited<ReturnType<ReturnType<typeof fetchInscriptionByParam>>>;

export function useGetInscriptionByParamQuery<T extends unknown = FetchInscriptionResp>(
  param: string,
  options?: AppUseQueryConfig<FetchInscriptionResp, T>
) {
  return useQuery({
    enabled: !!param,
    queryKey: ['inscription-by-param', param],
    queryFn: () => fetchInscriptionByParam()(param),
    ...inscriptionQueryOptions,
    ...options,
  });
}
