import { useCallback, useState } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useCheckInscribedUtxos(txIds: string[]) {
  const client = useBitcoinClient();
  const analytics = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const { isTestnet } = useCurrentNetworkState();

  const blockTransaction = useCallback(() => {
    // To-Do
    return;
  }, []);

  const checkIfUtxosListIncludesInscribed = useCallback(async () => {
    setIsLoading(true);
    try {
      // no need to check for inscriptions on testnet
      if (isTestnet) {
        return false;
      }

      const responses = await Promise.all(
        txIds.map(id => client.bestinslotInscriptionsApi.getInscriptionsByTransactionId(id))
      );
      const hasInscribedUtxo = responses.some(resp => {
        return resp.data.length > 0;
      });

      if (hasInscribedUtxo) {
        void analytics.track('utxos_includes_inscribed_one', {
          txIds,
        });
      }

      return hasInscribedUtxo;
    } catch (e) {
      // TO-DO what to do with error? maybe try to refetch at least once?
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [client.bestinslotInscriptionsApi, txIds, isTestnet, analytics]);

  return {
    checkIfUtxosListIncludesInscribed,
    blockTransaction,
    isLoading,
  };
}
