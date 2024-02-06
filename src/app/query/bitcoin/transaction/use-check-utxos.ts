import { useCallback, useState } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useCheckInscribedUtxos(txids: string[], blockTxAction?: () => void) {
  const client = useBitcoinClient();
  const analytics = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const { isTestnet } = useCurrentNetworkState();

  const preventTransaction = useCallback(() => {
    if (blockTxAction) return blockTxAction();

    // To-Do default action to block transaction

    return;
  }, [blockTxAction]);

  const checkIfUtxosListIncludesInscribed = useCallback(async () => {
    setIsLoading(true);
    try {
      // no need to check for inscriptions on testnet
      if (isTestnet) {
        return false;
      }

      if (txids.length === 0) {
        throw new Error('Utxos list cannot be empty');
      }

      const responses = await Promise.all(
        txids.map(id => client.bestinslotInscriptionsApi.getInscriptionsByTransactionId(id))
      );
      const hasInscribedUtxo = responses.some(resp => {
        return resp.data.length > 0;
      });

      if (hasInscribedUtxo) {
        void analytics.track('utxos_includes_inscribed_one', {
          txids,
        });
        preventTransaction();
        return true;
      }

      return false;
    } catch (e) {
      // TO-DO what to do with error? maybe try to refetch at least once?
      preventTransaction();
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [client.bestinslotInscriptionsApi, txids, isTestnet, analytics, preventTransaction]);

  return {
    checkIfUtxosListIncludesInscribed,
    isLoading,
  };
}
