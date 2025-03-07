import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { StacksTransactionWire, broadcastTransaction } from '@stacks/transactions';

import { delay, isError, isString } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { getErrorMessage } from '@app/common/get-error-message';
import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';
import { useUiActions } from '@app/store/ui/ui.slice';

const timeForApiToUpdate = 250;

export function useStacksBroadcastTransaction() {
  const toast = useToast();
  const navigate = useNavigate();
  const { setBroadcasting } = useUiActions();
  const refreshAccountData = useRefreshAllAccountData();
  const stacksNetwork = useCurrentStacksNetworkState();

  return useCallback(
    async (signedTx: StacksTransactionWire) => {
      setBroadcasting(true);

      function onError(e: Error | string) {
        setBroadcasting(false);
        const message = isString(e) ? e : e.message;
        navigate(RouteUrls.BroadcastError, { state: { message } });
      }

      function onSuccess() {
        setBroadcasting(false);
        toast.success('Transaction submitted!');
        navigate(RouteUrls.Activity);
      }

      try {
        const response = await broadcastTransaction({
          transaction: signedTx,
          network: stacksNetwork,
        });

        await delay(500);

        if ('error' in response) {
          logger.error('Transaction failed to broadcast', response);
          if (response.reason) toast.error(getErrorMessage(response.reason));
          onError(response.error);
          return;
        }

        if (!response.txid) {
          logger.error('Transaction failed to broadcast', response);
          setBroadcasting(false);
          return;
        }

        logger.info('Transaction broadcast', response);
        await delay(500);
        void analytics.track('broadcast_transaction', { symbol: 'stx' });

        onSuccess();
        await refreshAccountData(timeForApiToUpdate);
        return { txid: response.txid, transaction: signedTx };
      } catch (error) {
        logger.error('Transaction error', { error });
        onError(isError(error) ? error : { name: '', message: '' });
        return;
      }
    },
    [setBroadcasting, navigate, stacksNetwork, refreshAccountData, toast]
  );
}
