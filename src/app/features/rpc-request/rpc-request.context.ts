import { createContext, useContext } from 'react';

interface RpcRequestContext<T> {
  origin: string;
  requestId: string;
  tabId: number;
  rpcRequest: T;
  isLoadingData: boolean;
  onSetIsLoadingData(value: boolean): void;
  onClickRequestedByLink(): void;
}

export const rpcRequestContext = createContext<RpcRequestContext<any> | null>(null);

export function useRpcRequestContext<T>() {
  const context = useContext(rpcRequestContext) as RpcRequestContext<T>;
  if (!context)
    throw new Error('`useRpcRequestContext` must be used within a `RpcRequestProvider`');
  return context;
}
