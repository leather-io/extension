import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import { useQueries } from '@tanstack/react-query';
import * as yup from 'yup';

import { isTypedArray } from '@shared/utils';
import { Prettify } from '@shared/utils/type-utils';

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
  const resp = await fetchOrdinalsAwareUtxo(id, index);
  if (resp.all_inscriptions) return resp.all_inscriptions.length;
  if (resp.inscriptions) return 1;
  return 0;
}

async function fetchOrdinalsAwareUtxo(
  txid: string,
  index: number
): Promise<OrdApiInscriptionTxOutput> {
  const res = await fetch(`https://ordapi.xyz/output/${txid}:${index}`);

  if (!res.ok) throw new Error('Failed to fetch txid metadata');

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  if (Object.keys(data).length === 0) throw new Error('No output data found');
  return ordApiGetTransactionOutput.validate(data);
}

function makeOrdinalsAwareUtxoQueryKey(txId: string, txIndex: number) {
  return [QueryPrefixes.InscriptionFromTxid, txId, txIndex] as const;
}

const queryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

export function useOrdinalsAwareUtxoQueries(utxos: TaprootUtxo[] | btc.TransactionInputRequired[]) {
  return useQueries({
    queries: utxos.map(utxo => {
      const txId = isTypedArray(utxo.txid) ? bytesToHex(utxo.txid) : utxo.txid;
      const txIndex = 'index' in utxo ? utxo.index : utxo.vout;
      return {
        queryKey: makeOrdinalsAwareUtxoQueryKey(txId, txIndex),
        queryFn: () => fetchOrdinalsAwareUtxo(txId, txIndex),
        select: (resp: OrdApiInscriptionTxOutput) =>
          ({ ...utxo, ...resp } as TaprootUtxo & OrdApiInscriptionTxOutput),
        ...queryOptions,
      };
    }),
  });
}
