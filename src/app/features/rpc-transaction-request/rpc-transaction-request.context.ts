import { createContext, useContext } from 'react';

import type { StacksUnsignedContractCallOptions } from '@leather.io/stacks';

export interface RpcCallContractRequestContext {
  txOptions: StacksUnsignedContractCallOptions;
}

export type RpcRequestData = RpcCallContractRequestContext;

interface RpcTransactionRequestContext<T> {
  origin: string;
  requestId: string;
  tabId: number;
  rpcRequest: T;
  isBroadcasting: boolean;
  isLoading: boolean;
  isSubmitted: boolean;
  onSetIsBroadcasting(value: boolean): void;
  onSetIsLoading(value: boolean): void;
  onSetIsSubmitted(value: boolean): void;
  onClickRequestedByLink(): void;
}

function createRpcTransactionRequestContext<T extends RpcRequestData>() {
  return createContext<RpcTransactionRequestContext<T> | null>(null);
}

export const rpcTransactionRequestContext = createRpcTransactionRequestContext();

export function useRpcTransactionRequestContext<T extends RpcRequestData>() {
  const context = useContext(rpcTransactionRequestContext) as RpcTransactionRequestContext<T>;
  if (!context)
    throw new Error(
      '`useRpcTransactionRequestContext` must be used within a `RpcTransactionRequestProvider`'
    );
  return context;
}
