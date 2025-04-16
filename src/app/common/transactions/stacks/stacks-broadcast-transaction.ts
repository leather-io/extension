import type { StacksNetwork } from '@stacks/network';
import {
  StacksTransactionWire,
  type TxBroadcastResultRejected,
  broadcastTransaction,
} from '@stacks/transactions';

import { delay, isError } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { analytics } from '@shared/utils/analytics';

interface StacksBroadcastTransactionArgs {
  network: StacksNetwork;
  signedTx: StacksTransactionWire;
  onSuccess(txid: string, transaction: StacksTransactionWire): void;
  onError(error: Error | string, reason?: TxBroadcastResultRejected['reason']): void;
}
export async function stacksBroadcastTransaction({
  network,
  signedTx,
  onSuccess,
  onError,
}: StacksBroadcastTransactionArgs) {
  try {
    const response = await broadcastTransaction({
      transaction: signedTx,
      network,
    });

    await delay(500);

    if ('error' in response) {
      logger.error('Transaction failed to broadcast', response);
      onError(response.error, response.reason);
      return;
    }

    if (!response.txid) {
      logger.error('Transaction failed to broadcast', response);
      return;
    }

    logger.info('Transaction broadcast', response);
    void analytics.track('broadcast_transaction', { symbol: 'stx' });

    await delay(500);

    onSuccess(response.txid, signedTx);
    return;
  } catch (error) {
    logger.error('Transaction error', { error });
    onError(isError(error) ? error : { name: '', message: '' });
    return;
  }
}
