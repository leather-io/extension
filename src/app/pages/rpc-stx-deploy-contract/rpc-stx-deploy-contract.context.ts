import { createContext, useContext } from 'react';

import type { StacksNetwork } from '@stacks/network';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

import type { RpcStxDeployContractRequest } from './rpc-stx-deploy-contract.utils';

interface RpcStxDeployContractContext extends RpcTransactionRequest {
  address: string;
  rpcRequest: RpcStxDeployContractRequest;
  network: StacksNetwork;
  publicKey: string;
}

const rpcStxDeployContractContext = createContext<RpcStxDeployContractContext | null>(null);

export function useRpcStxDeployContractContext() {
  const context = useContext(rpcStxDeployContractContext);
  if (!context)
    throw new Error(
      '`useRpcStxDeployContractContext` must be used within a `RpcStxDeployContractProvider`'
    );
  return context;
}

export const RpcStxDeployContractProvider = rpcStxDeployContractContext.Provider;
