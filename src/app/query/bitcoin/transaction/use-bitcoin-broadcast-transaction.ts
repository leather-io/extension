import { useCallback, useState } from 'react';

import { delay } from '@app/common/utils';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

interface BroadcastCallbackArgs {
  tx: string;
  onSuccess?(txid: string): void;
  onError?(error: Error): void;
  onFinally?(): void;
}

export function useBitcoinBroadcastTransaction() {
  const client = useBitcoinClient();
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const broadcastTx = useCallback(
    async ({ tx, onSuccess, onError, onFinally }: BroadcastCallbackArgs) => {
      try {
        setIsBroadcasting(true);
        const resp = await client.transactionsApi.broadcastTransaction(tx);
        // simulate slower broadcast time to allow mempool refresh
        await delay(700);
        if (!resp.ok) throw new Error(await resp.text());
        const txid = await resp.text();
        onSuccess?.(txid);
        return txid;
      } catch (e) {
        onError?.(e as Error);
        return;
      } finally {
        setIsBroadcasting(false);
        onFinally?.();
        return;
      }
    },
    [client.transactionsApi]
  );

  return { broadcastTx, isBroadcasting };
}
