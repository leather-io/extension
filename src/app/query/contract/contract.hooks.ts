import { UseQueryOptions } from 'react-query';
import type { TransactionPayload } from '@stacks/connect';
import { ContractInterfaceFunction } from '@stacks/rpc-client';

import { ContractInterfaceResponseWithFunctions } from '@shared/models/contract-types';
import { useGetContractInterface } from '@app/query/contract/contract.query';
import { useContractInterfaceState } from '@app/store/contracts/contract.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

export function useContractInterface(transactionRequest: TransactionPayload | null) {
  const [, setContractInterface] = useContractInterfaceState();
  const queryOptions: UseQueryOptions<ContractInterfaceResponseWithFunctions> = {
    onSuccess: (data: ContractInterfaceResponseWithFunctions) => {
      if (data) setContractInterface(data);
    },
  };
  return useGetContractInterface(transactionRequest, queryOptions);
}

export const useContractFunction = () => {
  const transactionRequest = useTransactionRequestState();
  const [contractInterface] = useContractInterfaceState();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call' || !contractInterface)
    return;

  const selectedFunction = contractInterface.functions.find((func: ContractInterfaceFunction) => {
    return func.name === transactionRequest.functionName;
  });

  if (!selectedFunction) {
    throw new Error(
      `Attempting to call a function (\`${transactionRequest.functionName}\`) that ` +
        `does not exist on contract ${transactionRequest.contractAddress}.${transactionRequest.contractName}`
    );
  }
  return selectedFunction;
};
