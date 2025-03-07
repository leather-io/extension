import { useCallback } from 'react';
import { useAsync } from 'react-async-hook';

import type { StacksTransactionWire } from '@stacks/transactions';

import type { Money } from '@leather.io/models';
import { type RpcMethodNames, createRpcSuccessResponse } from '@leather.io/rpc';
import {
  type StacksUnsignedTransactionOptions,
  generateStacksUnsignedTransaction,
} from '@leather.io/stacks';

import { logger } from '@shared/logger';

import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';
import { useUiActions } from '@app/store/ui/ui.slice';

import { useRpcRequestParams } from './use-rpc-request-params';
import { useStacksBroadcastTransaction } from './use-stacks-broadcast-transaction';

interface UserSetTxOptions {
  fee: Money | null;
  nonce: number | string;
}

export function useUnsignedStacksTransaction(options: StacksUnsignedTransactionOptions) {
  return useAsync(async () => generateStacksUnsignedTransaction(options), [options]).result;
}

export function useRpcBroadcastStacksTransaction(method: RpcMethodNames) {
  const { tabId, requestId } = useRpcRequestParams();
  const signStacksTransaction = useSignStacksTransaction();
  const stacksBroadcastTransaction = useStacksBroadcastTransaction();
  const { setSubmitted } = useUiActions();

  return useCallback(
    async (unsignedTx: StacksTransactionWire, { fee, nonce }: UserSetTxOptions) => {
      fee && unsignedTx.setFee(fee.amount.toNumber());
      unsignedTx.setNonce(nonce);

      const signedTx = await signStacksTransaction(unsignedTx);
      if (!signedTx) return logger.error('No signed stacks transaction to broadcast');

      const result = await stacksBroadcastTransaction(signedTx);
      if (!result) throw new Error('Error broadcasting stacks transaction');

      chrome.tabs.sendMessage(
        tabId,
        createRpcSuccessResponse(method, {
          id: requestId,
          result: {
            txid: result.txid,
            transaction: result.transaction.serialize(),
          },
        })
      );
      setSubmitted(true);
    },
    [method, requestId, setSubmitted, signStacksTransaction, stacksBroadcastTransaction, tabId]
  );
}
