import { useState } from 'react';

import type { RpcMethodNames } from '@leather.io/rpc';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import type { HasChildren } from '@app/common/has-children';

import { rpcRequestContext as RpcRequestContext } from './rpc-request.context';
import { useRpcRequestParams } from './use-rpc-request-params';

interface RpcRequestProviderProps<T> extends HasChildren {
  isLoading: boolean;
  method: RpcMethodNames;
  requestData: T;
}
export function RpcRequestProvider<T>({
  children,
  isLoading,
  method,
  requestData,
}: RpcRequestProviderProps<T>) {
  const [isLoadingData, setIsLoadingData] = useState(isLoading);

  const { origin, requestId, tabId } = useRpcRequestParams();

  if (origin === null) {
    closeWindow();
    throw new Error(RpcErrorMessage.NullOrigin);
  }

  return (
    <RpcRequestContext.Provider
      value={{
        origin,
        requestId,
        tabId,
        isLoadingData,
        rpcRequest: requestData,
        onSetIsLoadingData: (value: boolean) => setIsLoadingData(value),
        onClickRequestedByLink() {
          void analytics.track('user_clicked_requested_by_link', {
            endpoint: method,
          });
          focusTabAndWindow(tabId);
        },
      }}
    >
      {children}
    </RpcRequestContext.Provider>
  );
}
