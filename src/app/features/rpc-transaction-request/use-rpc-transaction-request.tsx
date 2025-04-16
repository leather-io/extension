import { useState } from 'react';

import type { RpcMethodNames } from '@leather.io/rpc';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import { useRpcRequestParams } from '@app/common/hooks/use-rpc-request-params';

export interface RpcTransactionRequest {
  origin: string;
  requestId: string;
  tabId: number;
  isBroadcasting: boolean;
  isLoading: boolean;
  isSubmitted: boolean;
  onSetIsBroadcasting(value: boolean): void;
  onSetIsLoading(value: boolean): void;
  onSetIsSubmitted(value: boolean): void;
}

export function useRpcTransactionRequest() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    isBroadcasting,
    isLoading,
    isSubmitted,
    onClickRequestedByLink,
    onSetIsBroadcasting: (value: boolean) => setIsBroadcasting(value),
    onSetIsLoading: (value: boolean) => setIsLoading(value),
    onSetIsSubmitted: (value: boolean) => setIsSubmitted(value),
  };
}
