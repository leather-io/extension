import { ContractCallPayload, TransactionTypes } from '@stacks/connect';
import { useQuery } from '@tanstack/react-query';

import { ContractInterfaceResponseWithFunctions } from '@shared/models/contract-types';

import { useStacksClient } from '@app/store/common/api-clients.hooks';

export function useGetContractInterface(transactionRequest: ContractCallPayload | null) {
  const { smartContractsApi } = useStacksClient();

  const fetchContractInterface = () => {
    if (!transactionRequest || transactionRequest?.txType !== TransactionTypes.ContractCall) return;
    const contractAddress = transactionRequest.contractAddress;
    const contractName = transactionRequest.contractName;

    return smartContractsApi.getContractInterface({
      contractAddress,
      contractName,
    }) as unknown as Promise<ContractInterfaceResponseWithFunctions>;
  };

  return useQuery({
    enabled: !!transactionRequest,
    queryKey: [
      'contract-interface',
      transactionRequest?.contractName,
      transactionRequest?.contractAddress,
    ],
    queryFn: fetchContractInterface,
  });
}
