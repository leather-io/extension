import { useCallback, useState } from 'react';

import { isError } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { delay } from '@app/common/utils';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

interface BroadcastCallbackArgs {
  tx: string;
  checkForInscribedUtxos?(): Promise<boolean>;
  delayTime?: number;
  onSuccess?(txid: string): void;
  onError?(error: Error): void;
  onFinally?(): void;
}

export function useBitcoinBroadcastTransaction() {
  const client = useBitcoinClient();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const analytics = useAnalytics();

  const broadcastTx = useCallback(
    async ({
      tx,
      onSuccess,
      onError,
      onFinally,
      delayTime = 700,
      checkForInscribedUtxos,
    }: BroadcastCallbackArgs) => {
      try {
        // To-Do implement check in all btc related flows and remove conditional usage
        // add explicit check in broadcastTx to ensure that utxos are checked before broadcasting
        const hasInscribedUtxos = await checkForInscribedUtxos?.();
        if (hasInscribedUtxos) {
          return;
        }

        setIsBroadcasting(true);
        const resp = await client.transactionsApi.broadcastTransaction(tx);
        // simulate slower broadcast time to allow mempool refresh
        await delay(delayTime);
        if (!resp.ok) throw new Error(await resp.text());
        const txid = await resp.text();
        onSuccess?.(txid);
        return txid;
      } catch (e) {
        onError?.(e as Error);
        void analytics.track('error_broadcasting_transaction', {
          errorName: isError(e) ? e.name : 'unknown',
          errorMsg: isError(e) ? e.message : 'unknown',
        });
        return;
      } finally {
        setIsBroadcasting(false);
        onFinally?.();
        return;
      }
    },
    [analytics, client.transactionsApi]
  );

  return { broadcastTx, isBroadcasting };
}
