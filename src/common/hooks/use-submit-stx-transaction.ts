import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  broadcastTransaction,
  StacksTransaction,
  TxBroadcastResultRejected,
} from '@stacks/transactions';

import { todaysIsoDate } from '@common/date-utils';
import { useWallet } from '@common/hooks/use-wallet';
import { useLoading } from '@common/hooks/use-loading';
import { logger } from '@common/logger';
import { RouteUrls } from '@routes/route-urls';
import { useHomeTabs } from '@common/hooks/use-home-tabs';
import { useRefreshAllAccountData } from '@common/hooks/account/use-refresh-all-account-data';
import { useCurrentStacksNetworkState } from '@store/network/networks.hooks';
import { useCurrentAccountTxIds } from '@query/transactions/transaction.hooks';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';
import { useSetLocalTxsCallback } from '@store/accounts/account-activity.hooks';

function getErrorMessage(
  reason: TxBroadcastResultRejected['reason'] | 'ConflictingNonceInMempool'
) {
  switch (reason) {
    case 'ConflictingNonceInMempool':
      return 'Nonce conflict, try again soon.';
    case 'BadNonce':
      return 'Incorrect nonce.';
    case 'NotEnoughFunds':
      return 'Not enough funds.';
    case 'FeeTooLow':
      return 'Fee is too low.';
    default:
      return 'Something went wrong';
  }
}

const timeForApiToUpdate = 250;

interface UseSubmitTransactionArgs {
  loadingKey: string;
}
interface UseSubmitTransactionCallbackArgs {
  replaceByFee?: boolean;
  onClose(): void;
}
export function useSubmitTransactionCallback({ loadingKey }: UseSubmitTransactionArgs) {
  const refreshAccountData = useRefreshAllAccountData();
  const navigate = useNavigate();
  const { setLatestNonce } = useWallet();
  const { setIsLoading, setIsIdle } = useLoading(loadingKey);
  const stacksNetwork = useCurrentStacksNetworkState();
  const { setActiveTabActivity } = useHomeTabs();
  const setLocalTxs = useSetLocalTxsCallback();
  const externalTxid = useCurrentAccountTxIds();
  const analytics = useAnalytics();

  return useCallback(
    ({ replaceByFee, onClose }: UseSubmitTransactionCallbackArgs) =>
      async (transaction: StacksTransaction) => {
        setIsLoading();
        const nonce = !replaceByFee && Number(transaction.auth.spendingCondition?.nonce);
        try {
          const response = await broadcastTransaction(transaction, stacksNetwork);
          if (typeof response !== 'string') {
            if (response.reason) toast.error(getErrorMessage(response.reason));
            onClose();
            setIsIdle();
          } else {
            const txid = `0x${response}`;
            if (!externalTxid.includes(txid)) {
              await setLocalTxs({
                rawTx: transaction.serialize().toString('hex'),
                timestamp: todaysIsoDate(),
                txid,
              });
            }
            if (nonce) await setLatestNonce(nonce);
            toast.success('Transaction submitted!');
            void analytics.track('broadcast_transaction');
            onClose();
            setIsIdle();
            navigate(RouteUrls.Home);
            // switch active tab to activity
            setActiveTabActivity();
            await refreshAccountData(timeForApiToUpdate);
          }
        } catch (e) {
          logger.error(e);
          toast.error('Something went wrong');
          onClose();
          setIsIdle();
        }
      },
    [
      setIsLoading,
      stacksNetwork,
      setIsIdle,
      externalTxid,
      setLatestNonce,
      analytics,
      navigate,
      setActiveTabActivity,
      refreshAccountData,
      setLocalTxs,
    ]
  );
}

interface UseHandleSubmitTransactionArgs {
  loadingKey: string;
}
interface UseHandleSubmitTransactionReturnFn {
  transaction: StacksTransaction;
  replaceByFee?: boolean;
  onClose(): void;
}
export function useHandleSubmitTransaction({ loadingKey }: UseHandleSubmitTransactionArgs) {
  const broadcastTxCallback = useSubmitTransactionCallback({ loadingKey });

  return useCallback(
    ({ transaction, onClose, replaceByFee = false }: UseHandleSubmitTransactionReturnFn) =>
      broadcastTxCallback({ onClose, replaceByFee })(transaction),
    [broadcastTxCallback]
  );
}
