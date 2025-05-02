import { createContext, useContext } from 'react';

import type { StacksNetwork } from '@stacks/network';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

import type { RpcStxTransferSip10FtRequest } from './rpc-stx-transfer-sip10-ft.utils';

interface RpcStxTransferSip10FTContext extends RpcTransactionRequest {
  address: string;
  rpcRequest: RpcStxTransferSip10FtRequest;
  network: StacksNetwork;
  publicKey: string;
}

const rpcStxTransferSip10FtContext = createContext<RpcStxTransferSip10FTContext | null>(null);

export function useRpcStxTransferSip10FtContext() {
  const context = useContext(rpcStxTransferSip10FtContext);
  if (!context)
    throw new Error(
      '`useRpcStxTransferSip10FtContext` must be used within a `RpcStxTransferSip10FtProvider`'
    );
  return context;
}

export const RpcStxTransferSip10FtProvider = rpcStxTransferSip10FtContext.Provider;
