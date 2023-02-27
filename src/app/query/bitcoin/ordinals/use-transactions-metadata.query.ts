import { useQueries } from '@tanstack/react-query';

import { QueryPrefixes } from '@app/query/query-prefixes';

import { UtxoResponseItem } from '../bitcoin-client';
import { ordApiXyzGetTransactionOutput } from './utils';

export function useTransactionsMetadataQuery(utxos: UtxoResponseItem[]) {
  const results = useQueries({
    queries: utxos.map(utxo => ({
      cacheTime: Infinity,
      staleTime: 15 * 60 * 1000, // 15 minutes
      queryKey: [QueryPrefixes.InscriptionFromUtxo, utxo.txid] as const,
      queryFn: async ({
        queryKey,
      }: {
        queryKey: readonly [typeof QueryPrefixes.InscriptionFromUtxo, string];
      }) => {
        const [_, txid] = queryKey;

        const res = await fetch(`https://ordapi.xyz/output/${txid}:0`);

        if (!res.ok) throw new Error('Failed to fetch utxo metadata.');

        const data = await res.json();
        const validatedData = await ordApiXyzGetTransactionOutput.validate(data);
        return validatedData;
      },
    })),
  });

  return results;
}
