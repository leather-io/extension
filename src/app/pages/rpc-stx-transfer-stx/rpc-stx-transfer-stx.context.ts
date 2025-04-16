import { createContext, useContext } from 'react';

import type { StacksUnsignedTokenTransferOptions } from '@leather.io/stacks';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

interface RpcStxTransferStxContext extends RpcTransactionRequest {
  txOptions: StacksUnsignedTokenTransferOptions;
  onUserActivatesSwitchAccount(): void;
}

const rpcStxTransferStxContext = createContext<RpcStxTransferStxContext | null>(null);

export function useRpcStxTransferStxContext() {
  const context = useContext(rpcStxTransferStxContext);
  if (!context)
    throw new Error(
      '`useRpcStxTransferStxContext` must be used within a `RpcStxTransferStxProvider`'
    );
  return context;
}

export const RpcStxTransferStxProvider = rpcStxTransferStxContext.Provider;
