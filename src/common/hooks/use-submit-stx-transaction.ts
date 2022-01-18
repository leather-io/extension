import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  broadcastTransaction,
  StacksTransaction,
  TxBroadcastResultRejected,
} from '@stacks/transactions';

import { todaysIsoDate } from '@common/date-utils';
import { useChangeScreen } from '@common/hooks/use-change-screen';
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

interface UseSubmitTransactionCallbackArgs {
  replaceByFee?: boolean;
  onClose: () => void;
  loadingKey: string;
}
export function useSubmitTransactionCallback({
  replaceByFee,
  onClose,
  loadingKey,
}: UseSubmitTransactionCallbackArgs) {
  const refreshAccountData = useRefreshAllAccountData();
  const changeScreen = useChangeScreen();
  const { setLatestNonce } = useWallet();
  const { setIsLoading, setIsIdle } = useLoading(loadingKey);
  const stacksNetwork = useCurrentStacksNetworkState();
  const { setActiveTabActivity } = useHomeTabs();
  const setLocalTxs = useSetLocalTxsCallback();
  const externalTxid = useCurrentAccountTxIds();
  const analytics = useAnalytics();

  return useCallback<(tx: StacksTransaction) => Promise<void>>(
    async transaction => {
      setIsLoading();
      const nonce = !replaceByFee && transaction.auth.spendingCondition?.nonce.toNumber();
      try {
        const response = await broadcastTransaction(transaction, stacksNetwork);
        if (typeof response !== 'string') {
          toast.error(getErrorMessage(response.reason));
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
          changeScreen(RouteUrls.Home);
          onClose();
          setIsIdle();
          changeScreen(RouteUrls.Home);
          // switch active tab to activity
          setActiveTabActivity();
          await refreshAccountData(250); // delay to give the api time to receive the tx
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
      replaceByFee,
      stacksNetwork,
      onClose,
      setIsIdle,
      externalTxid,
      setLatestNonce,
      analytics,
      changeScreen,
      setActiveTabActivity,
      refreshAccountData,
      setLocalTxs,
    ]
  );
}

interface UseHandleSubmitTransactionArgs {
  transaction: StacksTransaction | null;
  onClose: () => void;
  loadingKey: string;
  replaceByFee?: boolean;
}
export function useHandleSubmitTransaction({
  transaction,
  onClose,
  loadingKey,
  replaceByFee = false,
}: UseHandleSubmitTransactionArgs) {
  const callback = useSubmitTransactionCallback({
    onClose,
    loadingKey,
    replaceByFee,
  });
  if (transaction) return () => callback(transaction);
  return () => null;
}
