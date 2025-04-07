import { useCallback, useState } from 'react';

import { TransactionInput } from '@scure/btc-signer/psbt';

import { decodeBitcoinTx } from '@leather.io/bitcoin';
import { filterOutIntentionalUtxoSpend } from '@leather.io/query';
import { delay } from '@leather.io/utils';

import { useBitcoinClient } from '../clients/bitcoin-client';
import { useCheckUnspendableUtxos } from './use-check-utxos';

interface BroadcastCallbackArgs {
  tx: string;
  skipSpendableCheckUtxoIds?: string[] | 'all';
  delayTime?: number;
  onSuccess?(txid: string): void;
  onError?(error: Error): void;
  onFinally?(): void;
}

export function useBitcoinBroadcastTransaction() {
  const client = useBitcoinClient();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const { checkIfUtxosListIncludesInscribed } = useCheckUnspendableUtxos();

  const broadcastTx = useCallback(
    async ({
      tx,
      onSuccess,
      onError,
      onFinally,
      skipSpendableCheckUtxoIds = [],
      delayTime = 700,
    }: BroadcastCallbackArgs) => {
      try {
        if (skipSpendableCheckUtxoIds !== 'all') {
          // Filter out intentional spend inscription txid from the check list
          const utxos: TransactionInput[] = filterOutIntentionalUtxoSpend({
            inputs: decodeBitcoinTx(tx).inputs,
            intentionalSpendUtxoIds: skipSpendableCheckUtxoIds,
          });

          const hasInscribedUtxos = await checkIfUtxosListIncludesInscribed(utxos);

          if (hasInscribedUtxos) {
            return;
          }
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
        return;
      } finally {
        setIsBroadcasting(false);
        onFinally?.();
      }
    },
    [checkIfUtxosListIncludesInscribed, client]
  );

  return { broadcastTx, isBroadcasting };
}
