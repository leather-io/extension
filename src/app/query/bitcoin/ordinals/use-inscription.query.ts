import { useQuery } from '@tanstack/react-query';

import { QueryPrefixes } from '@app/query/query-prefixes';

import { ordApiXyzGetInscriptionByInscriptionSchema } from './utils';

async function getInscriptionMetadata(path: string) {
  const res = await fetch(`https://ordapi.xyz${path}`);

  if (!res.ok) throw new Error('Error retrieving inscription metadata.');

  const data = await res.json();
  const validatedData = await ordApiXyzGetInscriptionByInscriptionSchema.validate(data);
  return validatedData;
}

export function useInscriptionQuery(path: string) {
  return useQuery([QueryPrefixes.InscriptionMetadata, path], () => getInscriptionMetadata(path), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}
