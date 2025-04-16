import { createContext, useContext } from 'react';

import type { Money } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';

import type { TransferRecipient } from '@shared/models/form.model';

interface RpcTransactionRequestContext {
  origin: string;
  requestId: string;
  tabId: number;
}

interface RpcSendTransferContext extends RpcTransactionRequestContext {
  amount: Money;
  isLoadingBalance: boolean;
  recipients: TransferRecipient[];
  recipientAddresses: string[];
  utxos: UtxoResponseItem[];
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
