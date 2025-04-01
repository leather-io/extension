import type { ClarityAbi } from '@stacks/transactions';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { StacksQueryPrefixes } from '@leather.io/query';

import { useStacksClient } from './stacks-client';

const queryOptions = {
  staleTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

export function useGetContractInterface(
  contractAddress: string,
  contractName: string
): UseQueryResult<ClarityAbi> {
  const client = useStacksClient();
  return useQuery({
    queryKey: [StacksQueryPrefixes.GetContractInterface, contractAddress, contractName],
    queryFn: () => client.getContractInterface(contractAddress, contractName),
    ...queryOptions,
  });
}
