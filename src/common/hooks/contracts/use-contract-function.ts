import { useContractInterfaceState } from '@store/contracts/contract.hooks';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';
import { ContractInterfaceFunction } from '@stacks/rpc-client';

export const useContractFunction = () => {
  const transactionRequest = useTransactionRequestState();
  const [contractInterface] = useContractInterfaceState();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call' || !contractInterface)
    return undefined;

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
