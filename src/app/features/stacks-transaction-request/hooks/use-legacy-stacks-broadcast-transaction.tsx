import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { AuthType, StacksTransactionWire } from '@stacks/transactions';

import type { CryptoCurrency } from '@leather.io/models';
import { delay, isError, isString } from '@leather.io/utils';

import { finalizeTxSignature } from '@shared/actions/finalize-tx-signature';
import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import {
  StacksTransactionActionType,
  stacksTransactionToHex,
} from '@app/common/transactions/stacks/transaction.utils';
import { useToast } from '@app/features/toasts/use-toast';
import { useTransactionRequest } from '@app/store/transactions/requests.hooks';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

async function simulateShortDelayToAvoidUndefinedTabId() {
  await delay(1000);
}

interface UseStacksBroadcastTransactionArgs {
  actionType?: StacksTransactionActionType;
  token: CryptoCurrency;
  redirectToSuccessPage?: boolean;
}
/**
 * @deprecated Use new version from `@app/common/transactions/stacks`
 */
export function useStacksBroadcastTransaction({
  actionType,
  token,
  redirectToSuccessPage,
}: UseStacksBroadcastTransactionArgs) {
  const signStacksTransaction = useSignStacksTransaction();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const { tabId } = useDefaultRequestParams();
  const requestToken = useTransactionRequest();

  const navigate = useNavigate();
  const toast = useToast();

  const isCancelTransaction = actionType === StacksTransactionActionType.Cancel;
  const isIncreaseFeeTransaction = actionType === StacksTransactionActionType.IncreaseFee;
  const isRpcRequest = actionType === StacksTransactionActionType.RpcRequest;

  const showSummaryPage = !isCancelTransaction && !isIncreaseFeeTransaction && !isRpcRequest;

  const broadcastTransactionFn = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.SUBMIT_STACKS_TRANSACTION,
  });

  return useMemo(() => {
    function handlePreviewSuccess(signedTx: StacksTransactionWire, txid?: string) {
      if (requestToken && tabId) {
        finalizeTxSignature({
          requestPayload: requestToken,
          tabId,
          data: {
            txRaw: stacksTransactionToHex(signedTx),
            txId: txid,
          },
        });
      }
      if (txid && redirectToSuccessPage) {
        void navigate(
          RouteUrls.SentStxTxSummary.replace(':symbol', token.toLowerCase()).replace(
            ':txid',
            `${txid}`
          ),
          { state: { tx: stacksTransactionToHex(signedTx) } }
        );
      }
    }

    async function broadcastTransactionAction(signedTx: StacksTransactionWire) {
      if (!signedTx) {
        logger.error('Cannot broadcast transaction, no tx in state');
        toast.error('Unable to broadcast transaction');
        return;
      }
      try {
        setIsBroadcasting(true);
        const isSponsored = signedTx.auth?.authType === AuthType.Sponsored;
        if (isSponsored) {
          await simulateShortDelayToAvoidUndefinedTabId();
          handlePreviewSuccess(signedTx);
        } else {
          return await broadcastTransactionFn({
            onError(e: Error | string) {
              const message = isString(e) ? e : e.message;
              return navigate(RouteUrls.BroadcastError, { state: { message } });
            },
            onSuccess(txId) {
              if (showSummaryPage) return handlePreviewSuccess(signedTx, txId);
              void navigate(RouteUrls.Activity);
              if (isCancelTransaction) return toast.success('Transaction cancelled successfully');
              if (isIncreaseFeeTransaction) return toast.success('Fee increased successfully');
              return;
            },
            replaceByFee: false,
          })(signedTx);
        }
      } catch (e) {
        return navigate(RouteUrls.BroadcastError, {
          state: { message: isError(e) ? e.message : 'Unknown error' },
        });
      } finally {
        setIsBroadcasting(false);
      }
    }

    async function broadcastTransaction(unsignedTx: StacksTransactionWire) {
      try {
        if (!unsignedTx) return;
        const signedTx = await signStacksTransaction(unsignedTx);
        // TODO: Maybe better error handling here?
        if (!signedTx) return;
        return await broadcastTransactionAction(signedTx);
      } catch (e) {}
    }

    return {
      stacksBroadcastTransaction: broadcastTransaction,
      isBroadcasting,
    };
  }, [
    isBroadcasting,
    requestToken,
    tabId,
    redirectToSuccessPage,
    navigate,
    token,
    toast,
    broadcastTransactionFn,
    showSummaryPage,
    isCancelTransaction,
    isIncreaseFeeTransaction,
    signStacksTransaction,
  ]);
}
