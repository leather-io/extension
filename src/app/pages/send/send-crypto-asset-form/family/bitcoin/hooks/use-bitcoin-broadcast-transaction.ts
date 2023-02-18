import { useMemo } from 'react';

import { hexToBytes } from '@stacks/common';
import * as btc from 'micro-btc-signer';

import { delay } from '@app/common/utils';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

export function useBitcoinBroadcastTransaction(tx: string) {
  const client = useBitcoinClient();

  return useMemo(() => {
    const psbt = btc.RawTx.decode(hexToBytes(tx));

    async function broadcastTransaction() {
      const resp = await client.transactionsApi.broadcastTransaction(tx);
      // simulate slower broadcast time to allow mempool refresh
      await delay(700);
      if (!resp.ok) throw new Error(await resp.text());
      return resp.text();
    }

    return { psbt, broadcastTransaction };
  }, [client.transactionsApi, tx]);
}
