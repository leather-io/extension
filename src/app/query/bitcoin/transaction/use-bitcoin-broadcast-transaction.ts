import { useCallback } from 'react';

import { delay } from '@app/common/utils';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

export function useBitcoinBroadcastTransaction() {
  const client = useBitcoinClient();

  return useCallback(
    async (tx: string) => {
      const resp = await client.transactionsApi.broadcastTransaction(tx);
      // simulate slower broadcast time to allow mempool refresh
      await delay(700);
      if (!resp.ok) throw new Error(await resp.text());
      return resp.text();
    },
    [client.transactionsApi]
  );
}
