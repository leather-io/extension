import { createContext, useContext } from 'react';

import type { StacksNetwork } from '@stacks/network';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

interface StacksRpcTransactionRequestContext extends RpcTransactionRequest {
  address: string;
  isLoadingBalance: boolean;
  network: StacksNetwork;
  publicKey: string;
}

const stacksRpcTransactionRequestContext = createContext<StacksRpcTransactionRequestContext | null>(
  null
);

export function useStacksRpcTransactionRequestContext() {
  const context = useContext(stacksRpcTransactionRequestContext);
  if (!context)
    throw new Error(
      '`useStacksRpcTransactionRequestContext` must be used within a `StacksRpcTransactionRequestProvider`'
    );
  return context;
}

export const StacksRpcTransactionRequestProvider = stacksRpcTransactionRequestContext.Provider;
