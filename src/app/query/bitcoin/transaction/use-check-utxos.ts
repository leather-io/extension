import { useCallback, useState } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useOrdiscanInscriptionsByAddressQuery } from '../ordinals/inscriptions.query';

export function useCheckInscribedUtxos(txids: string[], blockTxAction?: () => void) {
  const client = useBitcoinClient();
  const analytics = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const { isTestnet } = useCurrentNetworkState();
  const {
    data: ordInscriptionsList,
    refetch,
    isError,
  } = useOrdiscanInscriptionsByAddressQuery({
    address: '',
  });

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
      void analytics.track('error_checking_utxos_from_bestinslot', {
        txids,
      });
      // fallback to ordiscan
      await refetch();
      const hasInscriptions = ordInscriptionsList?.pages.some(page => {
        return page.some(v => {
          return txids.includes(v.owner_output);
        });
      });
      if (hasInscriptions && !isError) {
        preventTransaction();
      }

      return true;
    } finally {
      setIsLoading(false);
    }
  }, [
    client.bestinslotInscriptionsApi,
    txids,
    isTestnet,
    analytics,
    preventTransaction,
    refetch,
    ordInscriptionsList,
    isError,
  ]);

  return {
    checkIfUtxosListIncludesInscribed,
    isLoading,
  };
}
