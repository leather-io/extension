import { TransactionInput } from '@scure/btc-signer/psbt';
import { useQuery } from '@tanstack/react-query';

import { BitcoinTx } from '@leather.io/models';
import {
  BestinSlotInscriptionBatchInfoResponse,
  createBestInSlotInscription,
  createGetInscriptionsByParamQueryOptions,
  normalizeBestInSlotInscriptionResponse,
} from '@leather.io/query';
import { isUndefined } from '@leather.io/utils';

import { useBitcoinClient } from '../clients/bitcoin-client';
import { useGetInscriptionsByOutputList } from './inscriptions-by-param.query';

export function useInscriptionByOutput(transaction: BitcoinTx) {
  const client = useBitcoinClient();

  const inputsLength = transaction.vin.length;
  const index = inputsLength === 1 ? 0 : inputsLength - 2;
  const isPending = !transaction.status.confirmed;
  const id = isPending ? transaction.vin[index].txid : transaction.txid;
  const param = `output=${id}:${index}`;

  return useQuery({
    ...createGetInscriptionsByParamQueryOptions({
      isPending,
      param,
      BestInSlotApi: client.BestInSlotApi,
    }),
    select(resp) {
      const inscriptionResponse = resp.data[0]?.result?.[0];
      if (!inscriptionResponse) return;
      return createBestInSlotInscription(
        normalizeBestInSlotInscriptionResponse(inscriptionResponse)
      );
    },
  });
}

export function useInscriptionsByOutputs(inputs: TransactionInput[]) {
  const response = useGetInscriptionsByOutputList(inputs);

  return response
    .map(query => query.data?.data[0].result?.[0])
    .filter(
      (inscriptionResponse): inscriptionResponse is BestinSlotInscriptionBatchInfoResponse =>
        !isUndefined(inscriptionResponse)
    )
    .map(inscriptionResponse =>
      createBestInSlotInscription(normalizeBestInSlotInscriptionResponse(inscriptionResponse))
    );
}
