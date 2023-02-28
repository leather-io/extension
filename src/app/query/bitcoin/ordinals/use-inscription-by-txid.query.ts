import { useQuery } from '@tanstack/react-query';

import { OrdApiXyzGetTransactionOutput, ordApiXyzGetTransactionOutput } from './utils';

const queryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000, // 15 minutes
} as const;

async function getInscriptionByTxid(txid: string): Promise<OrdApiXyzGetTransactionOutput> {
  const res = await fetch(`https://ordapi.xyz/output/${txid}:0`);

  if (!res.ok) throw new Error('Failed to fetch txid metadata.');

  const data = await res.json();
  return ordApiXyzGetTransactionOutput.validate(data);
}

function makeInscriptionMetadataQueryKey(txid: string) {
  return ['inscription-from-txid', txid] as const;
}

export function useInscriptionByTxidQuery(txid: string) {
  return useQuery({
    queryKey: makeInscriptionMetadataQueryKey(txid),
    queryFn: () => getInscriptionByTxid(txid),
    ...queryOptions,
  });
}
