import { useQueries, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';

import { Prettify } from '@app/common/type-utils';
import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

import { TaprootUtxo } from './use-taproot-address-utxos.query';

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
  if (Object.keys(data).length === 0) throw new Error('No output data found');
  return ordApiGetTransactionOutput.validate(data);
}

function makeOrdinalsAwareUtxoQueryKey(txid: string) {
  return [QueryPrefixes.InscriptionFromTxid, txid] as const;
}

const queryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000, // 15 minutes
} as const;

export function useOrdinalsAwareUtxoQuery<T extends unknown = OrdApiXyzGetTransactionOutput>(
  { txid, vout }: TaprootUtxo,
  options?: AppUseQueryConfig<OrdApiXyzGetTransactionOutput, T>
) {
  return useQuery({
    queryKey: makeOrdinalsAwareUtxoQueryKey(txid),
    queryFn: () => getOrdinalsAwareUtxo(txid, vout),
    ...queryOptions,
    ...options,
  });
}

export function useOrdinalsAwareUtxoQueries(outputs: TaprootUtxo[]) {
  return useQueries({
    queries: outputs.map(utxo => ({
      queryKey: makeOrdinalsAwareUtxoQueryKey(utxo.txid),
      queryFn: () => getOrdinalsAwareUtxo(utxo.txid, utxo.vout),
      select: (resp: OrdApiXyzGetTransactionOutput) =>
        ({ ...utxo, ...resp } as TaprootUtxo & OrdApiXyzGetTransactionOutput),
      ...queryOptions,
    })),
  });
}
