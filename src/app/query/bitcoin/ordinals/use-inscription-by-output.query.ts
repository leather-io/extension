import { useQuery } from '@tanstack/react-query';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { AppUseQueryConfig } from '@app/query/query-config';

import { FetchInscriptionResp, fetchInscriptionByParam } from './use-inscription-by-param';

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
    queryFn: () => fetchInscriptionByParam()(param),
    ...inscriptionsByOutputQueryOptions,
    ...options,
  });
}
