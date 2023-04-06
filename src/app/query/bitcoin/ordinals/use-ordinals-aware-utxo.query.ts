import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import { useQueries, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';

import { isTypedArray } from '@shared/utils';
import { Prettify } from '@shared/utils/type-utils';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

import { TaprootUtxo } from './use-taproot-address-utxos.query';

/**
 * Schema of data used from the `GET https://ordapi.xyz/output/:tx` endpoint. Additional data
 * that is not currently used by the app may be returned by this endpoint.
 */
const ordApiGetTransactionOutput = yup
  .object({
    address: yup.string(),
    all_inscriptions: yup.array().of(yup.string()).optional(),
    inscriptions: yup.string(),
    script_pubkey: yup.string(),
    transaction: yup.string(),
    value: yup.string().required(),
  })
  .required();

export type OrdApiInscriptionTxOutput = Prettify<yup.InferType<typeof ordApiGetTransactionOutput>>;

export async function getNumberOfInscriptionOnUtxo(id: string, index: number) {
  const resp = await getOrdinalsAwareUtxo(id, index);
  return resp.all_inscriptions?.length ?? 1;
}

async function getOrdinalsAwareUtxo(
  txid: string,
  index: number
): Promise<OrdApiInscriptionTxOutput> {
  const res = await fetch(`https://ordapi.xyz/output/${txid}:${index}`);

  if (!res.ok) throw new Error('Failed to fetch txid metadata');

  const data = await res.json();
  if (Object.keys(data).length === 0) throw new Error('No output data found');
  return ordApiGetTransactionOutput.validate(data);
}

function makeOrdinalsAwareUtxoQueryKey(txId: string, txIndex: number) {
  return [QueryPrefixes.InscriptionFromTxid, txId, txIndex] as const;
}

const queryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000, // 15 minutes
} as const;

export function useOrdinalsAwareUtxoQuery<T extends unknown = OrdApiInscriptionTxOutput>(
  utxo: TaprootUtxo | btc.TransactionInputRequired,
  options?: AppUseQueryConfig<OrdApiInscriptionTxOutput, T>
) {
  const txId = isTypedArray(utxo.txid) ? bytesToHex(utxo.txid) : utxo.txid;
  const txIndex = 'index' in utxo ? utxo.index : utxo.vout;

  return useQuery({
    queryKey: makeOrdinalsAwareUtxoQueryKey(txId, txIndex),
    queryFn: () => getOrdinalsAwareUtxo(txId, txIndex),
    ...queryOptions,
    ...options,
  });
}

export function useOrdinalsAwareUtxoQueries(outputs: TaprootUtxo[]) {
  return useQueries({
    queries: outputs.map(utxo => ({
      queryKey: makeOrdinalsAwareUtxoQueryKey(utxo.txid, utxo.vout),
      queryFn: () => getOrdinalsAwareUtxo(utxo.txid, utxo.vout),
      select: (resp: OrdApiInscriptionTxOutput) =>
        ({ ...utxo, ...resp } as TaprootUtxo & OrdApiInscriptionTxOutput),
      ...queryOptions,
    })),
  });
}
