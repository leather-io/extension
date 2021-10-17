import { UseQueryOptions } from 'react-query';

import { ContractInterfaceResponseWithFunctions } from '@models/contract-types';
import { useGetContractInterface } from '@query/contract/contract.query';
import { TransactionPayload } from '@stacks/connect';
import { ContractInterfaceFunction } from '@stacks/rpc-client';
import { useContractInterfaceState } from '@store/contracts/contract.hooks';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';

export function useContractInterface(transactionRequest: TransactionPayload | null) {
  const [contractInterface, setContractInterface] = useContractInterfaceState();
  const queryOptions: UseQueryOptions<ContractInterfaceResponseWithFunctions> = {
    onSuccess: (data: ContractInterfaceResponseWithFunctions) => {
      if (data) setContractInterface(data);
    },
  };
  useGetContractInterface(transactionRequest, queryOptions as any);
  return contractInterface || {};
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
