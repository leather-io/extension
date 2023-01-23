import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { StacksTransaction, deserializeTransaction } from '@stacks/transactions';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import { useSignTransactionSoftwareWallet } from '@app/store/transactions/transaction.hooks';

export function useStacksBroadcastTransaction(unsignedTx: string) {
  const { setActiveTabActivity } = useHomeTabs();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();
  const navigate = useNavigate();

  const broadcastTransactionFn = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.CONFIRM_DRAWER,
  });

  return useMemo(() => {
    function handlePreviewClose() {
      navigate(RouteUrls.Home);
      void setActiveTabActivity();
    }

    async function broadcastTransactionAction(signedTx: StacksTransaction) {
      if (!signedTx) {
        logger.error('Cannot broadcast transaction, no tx in state');
        toast.error('Unable to broadcast transaction');
        return;
      }
      try {
        await broadcastTransactionFn({
          onClose() {
            handlePreviewClose();
          },
          onError(e) {
            handlePreviewClose();
            navigate(RouteUrls.TransactionBroadcastError, { state: { message: e.message } });
          },
          replaceByFee: false,
        })(signedTx);
      } catch (e) {
        handlePreviewClose();
        navigate(RouteUrls.TransactionBroadcastError, {
          state: { message: e instanceof Error ? e.message : 'unknown error' },
        });
      }
    }

    async function broadcastTransaction(unsignedTx: StacksTransaction) {
      if (!unsignedTx) return;
      const signedTx = signSoftwareWalletTx(unsignedTx);
      if (!signedTx) return;
      await broadcastTransactionAction(signedTx);
    }

    const deserializedTransaction = deserializeTransaction(unsignedTx);

    return {
      stacksDeserializedTransaction: deserializedTransaction,
      stacksBroadcastTransaction: broadcastTransaction,
    };
  }, [broadcastTransactionFn, navigate, setActiveTabActivity, signSoftwareWalletTx, unsignedTx]);
}
