import { createContext, useContext } from 'react';

import type { StacksNetwork } from '@stacks/network';

import type { RpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';

import type { RpcStxTransferSip9NftRequest } from './rpc-stx-transfer-sip9-nft.utils';

interface RpcStxTransferSip9NfTContext extends RpcTransactionRequest {
  address: string;
  rpcRequest: RpcStxTransferSip9NftRequest;
  network: StacksNetwork;
  publicKey: string;
}

const rpcStxTransferSip9NftContext = createContext<RpcStxTransferSip9NfTContext | null>(null);

export function useRpcStxTransferSip9NftContext() {
  const context = useContext(rpcStxTransferSip9NftContext);
  if (!context)
    throw new Error(
      '`useRpcStxTransferSip9NftContext` must be used within a `RpcStxTransferSip9NftProvider`'
    );
  return context;
}

export const RpcStxTransferSip9NftProvider = rpcStxTransferSip9NftContext.Provider;
