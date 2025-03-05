import { createContext, useContext } from 'react';

import type { StacksTransactionWire } from '@stacks/transactions';

import type { RpcRequestContext } from '@app/common/rpc/use-rpc-request';

export interface RpcCallContractContext extends RpcRequestContext {
  unsignedTx: StacksTransactionWire;
  onSignStacksTransaction(): void;
  onUserActivatesFeeEditor(): void;
}

const rpcCallContractContext = createContext<RpcCallContractContext | null>(null);

export function useRpcCallContractContext() {
  const context = useContext(rpcCallContractContext);
  if (!context)
    throw new Error('`useRpcCallContractContext` must be used within a `RpcCallContractProvider`');
  return context;
}

export const RpcCallContractProvider = rpcCallContractContext.Provider;
