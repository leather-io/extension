import type { TransactionPayload } from '@stacks/connect';
import { ContractInterfaceFunction } from '@stacks/rpc-client';

import { useGetContractInterface } from '@app/query/contract/contract.query';

import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

export function useContractInterface(transactionRequest: TransactionPayload | null) {
  return useGetContractInterface(transactionRequest).data;
}

export function useContractFunction() {
  const transactionRequest = useTransactionRequestState();
  const contractInterface = useContractInterface(transactionRequest);

  if (!transactionRequest || transactionRequest.txType !== 'contract_call' || !contractInterface)
    return;

  const selectedFunction = contractInterface.functions.find((func: ContractInterfaceFunction) => {
    return func.name === transactionRequest.functionName;
  });

  return selectedFunction;
}
