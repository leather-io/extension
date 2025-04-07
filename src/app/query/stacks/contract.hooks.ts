import type { ClarityAbiFunction } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';

import type { TransactionPayload } from '@shared/utils/legacy-requests';

import { createGetContractInterfaceQueryOptions } from './contract.query';
import { useStacksClient } from './stacks-client';

export function useContractFunction(transactionRequest: TransactionPayload | null) {
  const client = useStacksClient();
  return useQuery({
    ...createGetContractInterfaceQueryOptions({ client, transactionRequest }),
    select: resp =>
      resp?.functions.find((func: ClarityAbiFunction) => {
        if (!transactionRequest || transactionRequest.txType !== 'contract_call') return;
        return func.name === transactionRequest?.functionName;
      }),
  });
}
