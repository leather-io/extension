import { useQuery } from '@tanstack/react-query';

import { type ContractInterfaceFunction } from '@leather.io/query';

import type { TransactionPayload } from '@shared/utils/legacy-requests';

import { createGetContractInterfaceQueryOptions } from './contract.query';
import { useStacksClient } from './stacks-client';

export function useContractFunction(transactionRequest: TransactionPayload | null) {
  const client = useStacksClient();
  return useQuery({
    ...createGetContractInterfaceQueryOptions({ client, transactionRequest }),
    select: resp =>
      resp?.functions.find((func: ContractInterfaceFunction) => {
        if (!transactionRequest || transactionRequest.txType !== 'contract_call') return;
        return func.name === transactionRequest?.functionName;
      }),
  });
}
