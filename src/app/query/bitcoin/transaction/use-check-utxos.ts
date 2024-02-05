import { useCallback, useState } from 'react';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useCheckInscribedUtxos(txIds: string[]) {
  const client = useBitcoinClient();
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
      return responses.some(resp => {
        return resp.data.length > 0;
      });
    } catch (e) {
      blockTransaction();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [client.bestinslotInscriptionsApi, txIds, blockTransaction, isTestnet]);

  console.log({ checkIfUtxosListIncludesInscribed, blockTransaction, isLoading });

  return {
    checkIfUtxosListIncludesInscribed,
    blockTransaction,
    isLoading,
  };
}
