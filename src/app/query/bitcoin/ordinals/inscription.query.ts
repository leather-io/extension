import { useQuery } from '@tanstack/react-query';

import { Inscription } from '@shared/models/inscription.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

const inscriptionQueryOptions = {
  staleTime: Infinity,
  cacheTime: Infinity,
} as const;

/**
 * @param path - inscription/:inscription_id
 */
function fetchInscription() {
  return async (path: string) => {
    const res = await fetch(`https://ordapi.xyz${path}`);
    if (!res.ok) throw new Error('Error retrieving inscription metadata');
    const data = await res.json();
    return data as Inscription;
  };
}

type FetchInscriptionResp = Awaited<ReturnType<ReturnType<typeof fetchInscription>>>;

export function useGetInscriptionQuery<T extends unknown = FetchInscriptionResp>(
  path: string,
  options?: AppUseQueryConfig<FetchInscriptionResp, T>
) {
  return useQuery({
    enabled: !!path,
    queryKey: [QueryPrefixes.InscriptionMetadata, path],
    queryFn: () => fetchInscription()(path),
    ...inscriptionQueryOptions,
    ...options,
  });
}
