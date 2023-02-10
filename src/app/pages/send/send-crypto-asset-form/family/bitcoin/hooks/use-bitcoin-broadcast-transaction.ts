import { useMemo } from 'react';

import { hexToBytes } from '@stacks/common';
import * as btc from 'micro-btc-signer';

export function useBitcoinBroadcastTransaction(tx: string) {
  return useMemo(() => {
    const psbt = btc.RawTx.decode(hexToBytes(tx));

    function broadcastTransaction() {
      // TODO: Use new post query to broadcast raw tx
    }

    return {
      bitcoinDeserializedRawTransaction: psbt,
      bitcoinBroadcastTransaction: broadcastTransaction,
    };
  }, [tx]);
}
