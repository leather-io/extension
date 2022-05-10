import { broadcastRawTransaction } from '@stacks/transactions';
import { Buffer } from 'buffer';
import { logger } from '@shared/logger';
import { validateTxId } from '@app/common/validation/validate-tx-id';
import { delay } from '@app/common/utils';

async function simulateShortDelayToAvoidUndefinedTabId() {
  await delay(1000);
}

interface BroadcastTransactionOptions {
  txRaw: string;
  serialized: Buffer;
  isSponsored: boolean;
  attachment?: string;
  networkUrl: string;
}
export async function broadcastTransaction(options: BroadcastTransactionOptions) {
  const { txRaw, serialized, isSponsored, attachment, networkUrl } = options;

  if (isSponsored) {
    await simulateShortDelayToAvoidUndefinedTabId();
    return { txRaw };
  }

  try {
    const response = await broadcastRawTransaction(
      serialized,
      `${networkUrl}/v2/transactions`,
      attachment ? Buffer.from(attachment, 'hex') : undefined
    );

    if (response.error) throw new Error(response.error);

    const isValidTxId = validateTxId(response.txid);
    if (isValidTxId)
      return {
        txId: response.txid,
        txRaw,
      };
    logger.error(`Error broadcasting raw transaction -- ${response}`);
    throw new Error((response as any).error);
  } catch (e) {
    logger.error('Error broadcasting raw transaction');
    logger.error(e);
    throw new Error(e as any);
  }
}
