import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { StacksTransaction, deserializeTransaction } from '@stacks/transactions';

import { logger } from '@shared/logger';
import { CryptoCurrencies } from '@shared/models/currencies.model';
import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

import { useStacksTransactionSummary } from './use-stacks-transaction-summary';

export function useStacksBroadcastTransaction(
  unsignedTx: string,
  token: CryptoCurrencies,
  decimals?: number
) {
  const signStacksTransaction = useSignStacksTransaction();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const { formSentSummaryTxState } = useStacksTransactionSummary(token);
  const navigate = useNavigate();

  const broadcastTransactionFn = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.SUBMIT_SEND_FORM_TRANSACTION,
  });

  return useMemo(() => {
    function handlePreviewSuccess(txId: string, signedTx: StacksTransaction) {
      navigate(
        RouteUrls.SentStxTxSummary.replace(':symbol', token.toLowerCase()).replace(
          ':txId',
          `${txId}`
        ),
        formSentSummaryTxState(txId, signedTx, decimals)
      );
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
            handlePreviewSuccess(txId, signedTx);
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

    async function broadcastTransaction(unsignedTx: StacksTransaction) {
      try {
        if (!unsignedTx) return;
        const signedTx = await signStacksTransaction(unsignedTx);
        if (!signedTx) return;
        await broadcastTransactionAction(signedTx);
      } catch (e) {}
    }

    const deserializedTransaction = deserializeTransaction(unsignedTx);

    return {
      stacksDeserializedTransaction: deserializedTransaction,
      stacksBroadcastTransaction: broadcastTransaction,
      isBroadcasting,
    };
  }, [
    broadcastTransactionFn,
    navigate,
    signStacksTransaction,
    unsignedTx,
    isBroadcasting,
    token,
    formSentSummaryTxState,
    decimals,
  ]);
}
