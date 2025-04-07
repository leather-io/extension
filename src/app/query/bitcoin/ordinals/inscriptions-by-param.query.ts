import type { TransactionInput } from '@scure/btc-signer/psbt';
import { bytesToHex } from '@stacks/common';
import { useQueries } from '@tanstack/react-query';

import { createGetInscriptionsByParamQueryOptions } from '@leather.io/query';

import { useBitcoinClient } from '../clients/bitcoin-client';

export function useGetInscriptionsByOutputList(inputs: TransactionInput[]) {
  const client = useBitcoinClient();
  return useQueries({
    queries: inputs.map(input => {
      const param = input.txid ? `${bytesToHex(input.txid)}:${input.index}` : '';
      return createGetInscriptionsByParamQueryOptions({
        param,
        BestInSlotApi: client.BestInSlotApi,
      });
    }),
  });
}
