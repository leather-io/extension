import { useQuery, UseQueryOptions } from 'react-query';

import { ContractInterfaceResponseWithFunctions } from '@models/contract-types';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import { useApi } from '@store/common/api-clients.hooks';

export function useGetContractInterface(
  transactionRequest: TransactionPayload | undefined,
  reactQueryOptions: UseQueryOptions = {}
) {
  const { smartContractsApi } = useApi();

  const fetchContractInterface = () => {
    if (!transactionRequest || transactionRequest?.txType !== TransactionTypes.ContractCall) return;
    const contractAddress = transactionRequest.contractAddress;
    const contractName = transactionRequest.contractName;

    return smartContractsApi.getContractInterface({
      contractAddress,
      contractName,
    }) as unknown as Promise<ContractInterfaceResponseWithFunctions>;
  };

  return useQuery(['contract-interface', transactionRequest?.publicKey], fetchContractInterface, {
    enabled: !!transactionRequest,
    ...(reactQueryOptions as any),
  });
}
