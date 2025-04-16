import { createContext, useContext } from 'react';

import type { StacksUnsignedContractCallOptions } from '@leather.io/stacks';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

interface RpcStxCallContractContext extends RpcTransactionRequest {
  txOptions: StacksUnsignedContractCallOptions;
}

const rpcStxCallContractContext = createContext<RpcStxCallContractContext | null>(null);

export function useRpcStxCallContractContext() {
  const context = useContext(rpcStxCallContractContext);
  if (!context)
    throw new Error(
      '`useRpcStxCallContractContext` must be used within a `RpcStxCallContractProvider`'
    );
  return context;
}

export const RpcStxCallContractProvider = rpcStxCallContractContext.Provider;
