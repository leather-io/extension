import { useMemo } from 'react';

import { RpcErrorCode } from '@btckit/types';

import { WalletMethodMap, makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { closeWindow } from '@shared/utils';

import { useDefaultRequestParams } from './hooks/use-default-request-search-params';
import { initialSearchParams } from './initial-search-params';
import { useWalletType } from './use-wallet-type';

export function useRpcRequestParams() {
  const defaultParams = useDefaultRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      requestId: initialSearchParams.get('requestId') ?? '',
    }),
    [defaultParams]
  );
}

export function useRejectIfLedgerWallet(request: keyof WalletMethodMap) {
  const { walletType } = useWalletType();
  const { tabId, requestId } = useRpcRequestParams();
  if (walletType !== 'ledger' || !tabId) return;
  chrome.tabs.sendMessage(
    tabId,
    makeRpcErrorResponse(request, {
      id: requestId,
      error: {
        code: RpcErrorCode.INTERNAL_ERROR,
        message: 'Ledger wallet is not supported',
      },
    })
  );
  closeWindow();
}
