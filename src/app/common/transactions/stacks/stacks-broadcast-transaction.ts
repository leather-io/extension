import type { StacksNetwork } from '@stacks/network';
import {
  StacksTransactionWire,
  type TxBroadcastResultRejected,
  broadcastTransaction,
} from '@stacks/transactions';

import { delay, flattenObject, isError } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { analytics } from '@shared/utils/analytics';

import { createError, serializeError } from '@app/common/utils';
import { hiroFetchWrapper } from '@app/query/stacks/stacks-client';

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
  const attemptId = crypto.randomUUID();
  try {
    void analytics.untypedTrack('stacks_transaction_broadcast_initiated', {
      attemptId,
    });

    const response = await broadcastTransaction({
      transaction: signedTx,
      network,
      client: { fetch: hiroFetchWrapper },
    });

    await delay(500);

    if ('error' in response) {
      logger.error('Transaction failed to broadcast', response);
      const error = createError({
        ...flattenObject(response),
        name: response.reason,
        message: response.error,
      });
      throw error;
    }

    if (!response.txid) {
      logger.error('Transaction failed to broadcast', response);
      throw createError({
        name: 'TransactionBroadcastError',
        message: 'Transaction broadcast but returned no txid',
      });
    }

    logger.info('Transaction broadcast', response);
    void analytics.track('broadcast_transaction', { symbol: 'stx' });
    void analytics.untypedTrack('stacks_transaction_broadcast_succeeded', {
      attemptId,
    });

    await delay(500);

    onSuccess(response.txid, signedTx);
    return;
  } catch (error) {
    logger.error('Transaction error', { error });
    void analytics.untypedTrack('stacks_transaction_broadcast_failed', {
      attemptId,
      ...serializeError(error),
    });
    onError(isError(error) ? error : { name: '', message: '' });
    return;
  }
}
