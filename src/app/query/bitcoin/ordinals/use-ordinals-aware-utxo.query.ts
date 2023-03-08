import { useQueries, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';

import { Prettify } from '@app/common/type-utils';
import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

/**
 * Schema of data used from the `GET https://ordapi.xyz/output/:tx` endpoint. Additional data
 * that is not currently used by the app may be returned by this endpoint.
 */
const ordApiGetTransactionOutput = yup
  .object({
    inscriptions: yup.string(),
    address: yup.string(),
    script_pubkey: yup.string(),
    value: yup.string().required(),
    transaction: yup.string(),
  })
  .required();

type OrdApiXyzGetTransactionOutput = Prettify<yup.InferType<typeof ordApiGetTransactionOutput>>;

async function getOrdinalsAwareUtxo(
  txid: string,
  index: number
): Promise<OrdApiXyzGetTransactionOutput> {
  const res = await fetch(`https://ordapi.xyz/output/${txid}:${index}`);

  if (!res.ok) throw new Error('Failed to fetch txid metadata');

  const data = await res.json();
  return ordApiGetTransactionOutput.validate(data);
}

function makeOrdinalsAwareUtxoQueryKey(txid: string) {
  return [QueryPrefixes.InscriptionFromTxid, txid] as const;
}

const queryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000, // 15 minutes
} as const;

interface UseOrdinalsAwareUtxoQueryArgs {
  txid: string;
  index: number;
}
export function useOrdinalsAwareUtxoQuery<T extends unknown = OrdApiXyzGetTransactionOutput>(
  { txid, index }: UseOrdinalsAwareUtxoQueryArgs,
  options?: AppUseQueryConfig<OrdApiXyzGetTransactionOutput, T>
) {
  return useQuery({
    queryKey: makeOrdinalsAwareUtxoQueryKey(txid),
    queryFn: () => getOrdinalsAwareUtxo(txid, index),
    ...queryOptions,
    ...options,
  });
}

// ts-unused-exports:disable-next-line
export function useOrdinalsAwareUtxoQueries<T extends unknown = OrdApiXyzGetTransactionOutput>(
  outputs: UseOrdinalsAwareUtxoQueryArgs[],
  options?: AppUseQueryConfig<OrdApiXyzGetTransactionOutput, T>
) {
  return useQueries({
    queries: outputs.map(({ txid, index }) => ({
      queryKey: makeOrdinalsAwareUtxoQueryKey(txid),
      queryFn: () => getOrdinalsAwareUtxo(txid, index),
      ...queryOptions,
      ...options,
    })),
  });
}
