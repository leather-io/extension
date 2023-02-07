import { useMemo } from 'react';

import * as bitcoin from 'bitcoinjs-lib';

export function useBitcoinBroadcastTransaction(tx: string) {
  return useMemo(() => {
    const psbt = bitcoin.Psbt.fromHex(tx);

    function broadcastTransaction() {
      // TODO: Use new post query to broadcast raw tx
    }

    return {
      bitcoinDeserializedRawTransaction: psbt,
      bitcoinBroadcastTransaction: broadcastTransaction,
    };
  }, [tx]);
}
