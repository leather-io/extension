import type { ContractCallPayload } from '@stacks/connect';
import type { ContractInterfaceFunction } from '@stacks/rpc-client';

import { logger } from '@shared/logger';

import { formatContractId } from '@app/common/utils';
import { useGetContractInterface } from '@app/query/stacks/contract/contract.query';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

export function useContractInterface(transactionRequest: ContractCallPayload | null) {
  return useGetContractInterface(transactionRequest).data;
}

export function useContractFunction() {
  const transactionRequest = useTransactionRequestState();
  const contractInterface = useContractInterface(transactionRequest as ContractCallPayload);

  if (!transactionRequest || transactionRequest.txType !== 'contract_call' || !contractInterface)
    return;

  const selectedFunction = contractInterface.functions.find((func: ContractInterfaceFunction) => {
    return func.name === transactionRequest.functionName;
  });

  if (!selectedFunction) {
    logger.error(
      `Attempting to call a function (\`${transactionRequest.functionName}\`) that ` +
        `does not exist on contract ${formatContractId(
          transactionRequest.contractAddress,
          transactionRequest.contractName
        )}`
    );
  }

  return selectedFunction;
}
