import { useState } from 'react';

import type { RpcMethodNames } from '@leather.io/rpc';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import { useRpcRequestParams } from '@app/common/hooks/use-rpc-request-params';

type TransactionStatus = 'idle' | 'broadcasting' | 'submitted' | 'pending' | 'error';

export interface RpcTransactionRequest {
  origin: string;
  requestId: string;
  tabId: number;
  status: TransactionStatus;
  onClickRequestedByLink(method: RpcMethodNames): void;
  onSetTransactionStatus(status: TransactionStatus): void;
  onUserActivatesSwitchAccount(): void;
}

export function useRpcTransactionRequest(): RpcTransactionRequest {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const { origin, requestId, tabId } = useRpcRequestParams();

  if (origin === null) {
    closeWindow();
    throw new Error(RpcErrorMessage.NullOrigin);
  }

  function onClickRequestedByLink(method: RpcMethodNames) {
    void analytics.track('user_clicked_requested_by_link', {
      endpoint: method,
    });
    focusTabAndWindow(tabId);
  }

  return {
    origin,
    requestId,
    tabId,
    status,
    onClickRequestedByLink,
    onSetTransactionStatus: (status: TransactionStatus) => setStatus(status),
    onUserActivatesSwitchAccount: () => {},
  };
}
