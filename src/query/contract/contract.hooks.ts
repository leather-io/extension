import { UseQueryOptions } from 'react-query';

import { ContractInterfaceResponseWithFunctions } from '@models/contract-types';
import { useGetContractInterface } from '@query/contract/contract.query';
import { TransactionPayload } from '@stacks/connect';
import { useContractInterfaceState } from '@store/contracts/contract.hooks';

export function useContractInterface(transactionRequest: TransactionPayload | undefined) {
  const [contractInterface, setContractInterface] = useContractInterfaceState();
  const queryOptions: UseQueryOptions<ContractInterfaceResponseWithFunctions> = {
    onSuccess: (data: ContractInterfaceResponseWithFunctions) => {
      if (data) setContractInterface(data);
    },
  };
  useGetContractInterface(transactionRequest, queryOptions as any);
  return contractInterface || {};
}
