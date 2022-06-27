import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  broadcastTransaction,
  StacksTransaction,
  TxBroadcastResultRejected,
} from '@stacks/transactions';

import { todaysIsoDate } from '@app/common/date-utils';
import { useLoading } from '@app/common/hooks/use-loading';
import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { useCurrentStacksNetworkState } from '@app/store/network/networks.hooks';
import { useCurrentAccountTxIds } from '@app/query/transactions/transaction.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useSetLocalTxsCallback } from '@app/store/accounts/account-activity.hooks';

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
  const { setIsLoading, setIsIdle } = useLoading(loadingKey);
  const stacksNetwork = useCurrentStacksNetworkState();
  const { setActiveTabActivity } = useHomeTabs();
  const setLocalTxs = useSetLocalTxsCallback();
  const externalTxid = useCurrentAccountTxIds();
  const analytics = useAnalytics();

  return useCallback(
    ({ onClose }: UseSubmitTransactionCallbackArgs) =>
      async (transaction: StacksTransaction) => {
        setIsLoading();
        try {
          const response = await broadcastTransaction(transaction, stacksNetwork);
          if (response.error) {
            if (response.reason) toast.error(getErrorMessage(response.reason));
            onClose();
            setIsIdle();
          } else {
            const txid = `0x${response.txid}`;
            if (!externalTxid.includes(txid)) {
              await setLocalTxs({
                rawTx: transaction.serialize().toString('hex'),
                timestamp: todaysIsoDate(),
                txid,
              });
            }
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
