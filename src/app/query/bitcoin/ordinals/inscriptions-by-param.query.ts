import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { HIRO_INSCRIPTIONS_API_URL } from '@shared/constants';
import { Paginated } from '@shared/models/api-types';
import { Inscription } from '@shared/models/inscription.model';
import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { AppUseQueryConfig } from '@app/query/query-config';

type FetchInscriptionResp = Awaited<ReturnType<ReturnType<typeof fetchInscriptionsByParam>>>;

function fetchInscriptionsByParam() {
  return async (param: string) => {
    const res = await axios.get(`${HIRO_INSCRIPTIONS_API_URL}?${param}`);
    return res.data as Paginated<Inscription[]>;
  };
}

const weekInMs = 1000 * 60 * 60 * 24 * 7;
const inscriptionsByOutputQueryOptions = {
  staleTime: weekInMs,
  cacheTime: weekInMs,
} as const;

export function useGetInscriptionsByOutputQuery<T extends unknown = FetchInscriptionResp>(
  transaction: BitcoinTx,
  options?: AppUseQueryConfig<FetchInscriptionResp, T>
) {
  const inputsLength = transaction.vin.length;
  const index = inputsLength === 1 ? 0 : inputsLength - 2;
  const isPending = !transaction.status.confirmed;
  const id = isPending ? transaction.vin[index].txid : transaction.txid;
  const param = `output=${id}:${index}`;

  return useQuery({
    enabled: !!param,
    queryKey: ['inscription-by-param', isPending, param],
    queryFn: () => fetchInscriptionsByParam()(param),
    ...inscriptionsByOutputQueryOptions,
    ...options,
  });
}

const inscriptionsByOutputQueriesOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

export function useGetInscriptionsByOutputQueries(inputs: btc.TransactionInput[]) {
  return useQueries({
    queries: inputs.map(input => {
      const param = input.txid ? `output=${bytesToHex(input.txid)}:${input.index}` : '';

      return {
        queryKey: ['inscription-by-param', false, param],
        queryFn: () => fetchInscriptionsByParam()(param),
        ...inscriptionsByOutputQueriesOptions,
      };
    }),
  });
}
