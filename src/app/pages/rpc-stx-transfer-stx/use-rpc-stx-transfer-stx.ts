import { useMemo } from 'react';

import { makeUnsignedSTXTokenTransfer } from '@stacks/transactions';

import { RpcErrorCode, type StxTransferStxRequestParams } from '@leather.io/rpc';

import { logger } from '@shared/logger';
import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { closeWindow } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';

export function useRpcStxTransferStxParams() {
  const { origin, tabId } = useDefaultRequestParams();
  const requestId = initialSearchParams.get('requestId');
  const params = initialSearchParams.get('params');

  if (!origin || !params || !requestId) throw new Error('Invalid params');

  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 0,
      requestId,
      params: JSON.parse(decodeURIComponent(params)),
      // params: stxTransferStxRequestParamsSchema.parse(JSON.parse(decodeURIComponent(params))),
    }),
    [origin, tabId, requestId, params]
  );
}

export function useRpcStxTransferStx() {
  const { origin, params, requestId, tabId } = useRpcStxTransferStxParams();
  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({ token: '' });

  return useMemo(
    () => ({
      origin,
      // TODO: replace with schema infererence
      params: params as StxTransferStxRequestParams,
      async onSignStacksTransaction(fee: number, nonce: number) {
        const tx = await makeUnsignedSTXTokenTransfer({
          recipient: params.recipient,
          amount: params.amount,
          memo: params.memo,
          publicKey: params.publicKey,
        });

        if (!tx) return logger.error('No stacks transaction to sign');

        tx.setFee(fee);
        tx.setNonce(nonce);

        const result = await stacksBroadcastTransaction(tx);
        if (!result) throw new Error('Error broadcasting stacks transaction');

        chrome.tabs.sendMessage(
          tabId,
          makeRpcSuccessResponse('stx_transferStx', {
            id: requestId,
            result: {
              txid: result.txid,
              transaction: result.transaction.serialize(),
            } as any,
          })
        );
        closeWindow();
      },
      onCancel() {
        chrome.tabs.sendMessage(
          tabId,
          makeRpcErrorResponse('stx_transferStx', {
            id: requestId,
            error: {
              message: 'User denied signing stacks transaction',
              code: RpcErrorCode.USER_REJECTION,
            },
          })
        );
      },
    }),
    [origin, params, requestId, stacksBroadcastTransaction, tabId]
  );
}
