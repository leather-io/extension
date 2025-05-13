import { createContext, useContext } from 'react';

import type { StacksNetwork } from '@stacks/network';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

import type { RpcStxCallContractRequest } from './rpc-stx-call-contract.utils';

interface RpcStxCallContractContext extends RpcTransactionRequest {
  rpcRequest: RpcStxCallContractRequest;
  network: StacksNetwork;
  publicKey: string;
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
