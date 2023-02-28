import { useMemo } from 'react';

import { hexToBytes } from '@stacks/common';
import * as btc from 'micro-btc-signer';

import { createDelay } from '@app/common/utils';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

const simulateSlowerBroadcast = createDelay(700);

export function useBitcoinBroadcastTransaction(tx: string) {
  const client = useBitcoinClient();

  return useMemo(() => {
    const psbt = btc.RawTx.decode(hexToBytes(tx));

    async function broadcastTransaction() {
      const resp = await client.transactionsApi.broadcastTransaction(tx);
      await simulateSlowerBroadcast();
      return resp;
    }

    return { psbt, broadcastTransaction };
  }, [client.transactionsApi, tx]);
}
