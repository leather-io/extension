import { useQueries, useQuery } from '@tanstack/react-query';

import { Inscription } from '@shared/models/inscription.model';

import { AppUseQueryConfig, HIRO_INSCRIPTIONS_API_URL } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

const inscriptionQueryOptions = {
  staleTime: Infinity,
  cacheTime: Infinity,
} as const;

/**
 * @param path - inscription/:inscription_id
 */
export function fetchInscription() {
  return async (id: string) => {
    const res = await fetch(`${HIRO_INSCRIPTIONS_API_URL}/${id}`);
    if (!res.ok) throw new Error('Error retrieving inscription metadata');
    const data = await res.json();
    return data as Inscription;
  };
}

type FetchInscriptionResp = Awaited<ReturnType<ReturnType<typeof fetchInscription>>>;

export function useGetInscriptionQuery<T extends unknown = FetchInscriptionResp>(
  id: string,
  options?: AppUseQueryConfig<FetchInscriptionResp, T>
) {
  return useQuery({
    enabled: !!id,
    queryKey: [QueryPrefixes.InscriptionMetadata, id],
    queryFn: () => fetchInscription()(id),
    ...inscriptionQueryOptions,
    ...options,
  });
}

export function useGetInscriptionQueries(ids: string[]) {
  return useQueries({
    queries: ids.map(id => {
      return {
        enabled: !!id,
        queryKey: [QueryPrefixes.InscriptionMetadata, id],
        queryFn: () => fetchInscription()(id),
        ...inscriptionQueryOptions,
      };
    }),
  });
}
