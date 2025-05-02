import { createContext, useContext } from 'react';

import type { StacksNetwork } from '@stacks/network';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

import type { RpcStxTransferStxRequest } from './rpc-stx-transfer-stx.utils';

interface RpcStxTransferStxContext extends RpcTransactionRequest {
  network: StacksNetwork;
  publicKey: string;
  rpcRequest: RpcStxTransferStxRequest;
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
