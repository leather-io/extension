import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { StacksTransaction } from '@stacks/transactions';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import { useSignTransactionSoftwareWallet } from '@app/store/transactions/transaction.hooks';

export function useStacksBroadcastSwap() {
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const navigate = useNavigate();

  const broadcastTransactionFn = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.CONFIRM_DRAWER,
  });

  return useCallback(
    (unsignedTx: StacksTransaction) => {
      function handlePreviewSuccess(signedTx: StacksTransaction, txId: string) {
        navigate(RouteUrls.SwapSummary, { state: { signedTx, txId } });
      }

      async function broadcastTransactionAction(signedTx: StacksTransaction) {
        if (!signedTx) {
          logger.error('Cannot broadcast transaction, no tx in state');
          toast.error('Unable to broadcast transaction');
          return;
        }
        try {
          setIsBroadcasting(true);
          await broadcastTransactionFn({
            onError(e: Error | string) {
              const message = isString(e) ? e : e.message;
              navigate(RouteUrls.TransactionBroadcastError, { state: { message } });
            },
            onSuccess(txId) {
              handlePreviewSuccess(signedTx, txId);
            },
            replaceByFee: false,
          })(signedTx);
        } catch (e) {
          navigate(RouteUrls.TransactionBroadcastError, {
            state: { message: e instanceof Error ? e.message : 'Unknown error' },
          });
        } finally {
          setIsBroadcasting(false);
        }
      }

      async function broadcastTransaction() {
        if (!unsignedTx) return;
        const signedTx = signSoftwareWalletTx(unsignedTx);
        if (!signedTx) return;
        await broadcastTransactionAction(signedTx);
      }

      return {
        stacksBroadcastTransaction: broadcastTransaction,
        isBroadcasting,
      };
    },
    [broadcastTransactionFn, navigate, signSoftwareWalletTx, isBroadcasting]
  );
}
