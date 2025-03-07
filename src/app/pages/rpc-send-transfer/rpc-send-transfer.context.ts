import { createContext, useContext } from 'react';

import type { Money } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';

import type { TransferRecipient } from '@shared/models/form.model';

import type { RpcRequestContext } from '@app/common/rpc/use-rpc-request-params';

export interface RpcSendTransferContext extends RpcRequestContext {
  amount: Money;
  isLoadingBalance: boolean;
  recipients: TransferRecipient[];
  recipientAddresses: string[];
  utxos: UtxoResponseItem[];
  // TODO: Create `SwitchAccountEditor` and relocate
  onUserActivatesSwitchAccount(): void;
}

const rpcSendTransferContext = createContext<RpcSendTransferContext | null>(null);

export function useRpcSendTransferContext() {
  const context = useContext(rpcSendTransferContext);
  if (!context)
    throw new Error('`useRpcSendTransferContext` must be used within a `RpcSendTransferProvider`');
  return context;
}

export const RpcSendTransferProvider = rpcSendTransferContext.Provider;
