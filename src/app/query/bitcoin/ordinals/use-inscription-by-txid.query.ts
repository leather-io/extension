import { useQueries, useQuery } from '@tanstack/react-query';

import { QueryPrefixes } from '@app/query/query-prefixes';

import { OrdApiXyzGetTransactionOutput, ordApiXyzGetTransactionOutput } from './utils';

const queryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000, // 15 minutes
} as const;

async function getInscriptionByTxid(
  txid: string,
  index: number
): Promise<OrdApiXyzGetTransactionOutput> {
  const res = await fetch(`https://ordapi.xyz/output/${txid}:${index}`);

  if (!res.ok) throw new Error('Failed to fetch txid metadata.');

  const data = await res.json();
  return ordApiXyzGetTransactionOutput.validate(data);
}

function makeInscriptionMetadataQueryKey(txid: string) {
  return [QueryPrefixes.InscriptionFromTxid, txid] as const;
}

interface UseInscriptionByTxidQueryArgs {
  txid: string;
  index: number;
}
export function useInscriptionByTxidQuery({ txid, index }: UseInscriptionByTxidQueryArgs) {
  return useQuery({
    queryKey: makeInscriptionMetadataQueryKey(txid),
    queryFn: () => getInscriptionByTxid(txid, index),
    ...queryOptions,
  });
}

// ts-unused-exports:disable-next-line
export function useInscriptionByTxidQueries(outputs: UseInscriptionByTxidQueryArgs[]) {
  return useQueries({
    queries: outputs.map(({ txid, index }) => ({
      queryKey: makeInscriptionMetadataQueryKey(txid),
      queryFn: () => getInscriptionByTxid(txid, index),
      ...queryOptions,
    })),
  });
}
