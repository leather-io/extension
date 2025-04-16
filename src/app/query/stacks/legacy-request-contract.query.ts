import type { ClarityAbiFunction } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';

import { type StacksClient, StacksQueryPrefixes } from '@leather.io/query';
import { TransactionTypes } from '@leather.io/stacks';

import type { ContractCallPayload, TransactionPayload } from '@shared/utils/legacy-requests';

import { useStacksClient } from './stacks-client';

const queryOptions = {
  staleTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

interface CreateGetContractInterfaceQueryOptionsArgs {
  client: StacksClient;
  transactionRequest: TransactionPayload | null;
}
/**
 * @deprecated Legacy transaction request
 */
function createGetContractInterfaceQueryOptions({
  client,
  transactionRequest,
}: CreateGetContractInterfaceQueryOptionsArgs) {
  return {
    enabled: !!transactionRequest && transactionRequest.txType === TransactionTypes.ContractCall,
    queryKey: [
      StacksQueryPrefixes.GetContractInterface,
      (transactionRequest as ContractCallPayload)?.contractName,
      (transactionRequest as ContractCallPayload)?.contractAddress,
    ],
    queryFn: () => {
      if (!transactionRequest || transactionRequest?.txType !== TransactionTypes.ContractCall)
        return;
      const contractAddress = transactionRequest.contractAddress;
      const contractName = transactionRequest.contractName;
      return client.getContractInterface(contractAddress, contractName);
    },
    ...queryOptions,
  } as const;
}

/**
 * @deprecated Legacy transaction request
 */
export function useGetContractInterfaceQuery(transactionRequest: TransactionPayload | null) {
  const client = useStacksClient();
  return useQuery(createGetContractInterfaceQueryOptions({ client, transactionRequest }));
}

/**
 * @deprecated Legacy transaction request
 */
export function useLegacyRequestContractFunction(transactionRequest: TransactionPayload | null) {
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
