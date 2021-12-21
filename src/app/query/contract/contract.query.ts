import { useQuery, UseQueryOptions } from 'react-query';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';

import { ContractInterfaceResponseWithFunctions } from '@shared/models/contract-types';
import { useApi } from '@app/store/common/api-clients.hooks';

export function useGetContractInterface(
  transactionRequest: TransactionPayload | null,
  reactQueryOptions: UseQueryOptions<any> = {}
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

  return useQuery({
    queryKey: ['contract-interface', transactionRequest?.publicKey],
    queryFn: fetchContractInterface,
    ...reactQueryOptions,
  });
}
