import { useCallback, useState } from 'react';

import * as btc from '@scure/btc-signer';

import { decodeBitcoinTx } from '@shared/crypto/bitcoin/bitcoin.utils';
import { isError } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { delay } from '@app/common/utils';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import { filterOutIntentionalUtxoSpend, useCheckInscribedUtxos } from './use-check-utxos';

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
  const analytics = useAnalytics();
  const { checkIfUtxosListIncludesInscribed } = useCheckInscribedUtxos();

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
          const utxos: btc.TransactionInput[] = filterOutIntentionalUtxoSpend({
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
    [analytics, checkIfUtxosListIncludesInscribed, client]
  );

  return { broadcastTx, isBroadcasting };
}
