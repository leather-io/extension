import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { broadcastTransaction, StacksTransaction } from '@stacks/transactions';

import { useLoading } from '@app/common/hooks/use-loading';
import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { getErrorMessage } from '@app/common/get-error-message';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { bytesToHex } from '@stacks/common';

const timeForApiToUpdate = 250;

interface UseSubmitTransactionArgs {
  loadingKey: string;
}
interface UseSubmitTransactionCallbackArgs {
  replaceByFee?: boolean;
  onClose(): void;
  onError(error: Error): void;
}
export function useSubmitTransactionCallback({ loadingKey }: UseSubmitTransactionArgs) {
  const refreshAccountData = useRefreshAllAccountData();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const navigate = useNavigate();
  const { setIsLoading, setIsIdle } = useLoading(loadingKey);
  const stacksNetwork = useCurrentStacksNetworkState();
  const { setActiveTabActivity } = useHomeTabs();
  const analytics = useAnalytics();

  return useCallback(
    ({ onClose, onError }: UseSubmitTransactionCallbackArgs) =>
      async (transaction: StacksTransaction) => {
        setIsLoading();
        try {
          const response = await broadcastTransaction(transaction, stacksNetwork);
          if (response.error) {
            logger.error('Transaction broadcast', response);
            if (response.reason) toast.error(getErrorMessage(response.reason));
            onClose();
            setIsIdle();
          } else {
            logger.info('Transaction broadcast', response);
            submittedTransactionsActions.newTransactionSubmitted({
              rawTx: bytesToHex(transaction.serialize()),
              txId: safelyFormatHexTxid(response.txid),
            });
            toast.success('Transaction submitted!');
            void analytics.track('broadcast_transaction');
            onClose();
            setIsIdle();
            navigate(RouteUrls.Home);
            // switch active tab to activity
            setActiveTabActivity();
            await refreshAccountData(timeForApiToUpdate);
          }
        } catch (error) {
          logger.error('Transaction callback', { error });
          onError(error instanceof Error ? error : { name: '', message: '' });
          setIsIdle();
        }
      },
    [
      setIsLoading,
      stacksNetwork,
      setIsIdle,
      submittedTransactionsActions,
      analytics,
      navigate,
      setActiveTabActivity,
      refreshAccountData,
    ]
  );
}
