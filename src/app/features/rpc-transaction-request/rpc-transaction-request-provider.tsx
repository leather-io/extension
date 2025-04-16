import { useState } from 'react';

import type { RpcMethodNames } from '@leather.io/rpc';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import type { HasChildren } from '@app/common/has-children';
import { useRpcRequestParams } from '@app/common/hooks/use-rpc-request-params';

import {
  type RpcRequestData,
  rpcTransactionRequestContext as RpcTransactionRequestContext,
} from './rpc-transaction-request.context';

interface RpcTransactionRequestProviderProps<T> extends HasChildren {
  isLoadingData: boolean;
  method: RpcMethodNames;
  requestData: T;
}
export function RpcTransactionRequestProvider<T extends RpcRequestData>({
  children,
  isLoadingData,
  method,
  requestData,
}: RpcTransactionRequestProviderProps<T>) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isLoading, setIsLoading] = useState(isLoadingData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { origin, requestId, tabId } = useRpcRequestParams();

  if (origin === null) {
    closeWindow();
    throw new Error(RpcErrorMessage.NullOrigin);
  }

  return (
    <RpcTransactionRequestContext.Provider
      value={{
        origin,
        requestId,
        tabId,
        rpcRequest: requestData,
        isBroadcasting,
        isLoading,
        isSubmitted,
        onSetIsBroadcasting: (value: boolean) => setIsBroadcasting(value),
        onSetIsLoading: (value: boolean) => setIsLoading(value),
        onSetIsSubmitted: (value: boolean) => setIsSubmitted(value),
        onClickRequestedByLink() {
          void analytics.track('user_clicked_requested_by_link', {
            endpoint: method,
          });
          focusTabAndWindow(tabId);
        },
      }}
    >
      {children}
    </RpcTransactionRequestContext.Provider>
  );
}
