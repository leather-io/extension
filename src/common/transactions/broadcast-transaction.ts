import { broadcastRawTransaction } from '@stacks/transactions';
import { Buffer } from 'buffer';
import { logger } from '@common/logger';
import { validateTxId } from '@common/validation/validate-tx-id';

interface BroadcastTransactionOptions {
  txRaw: string;
  serialized: Buffer;
  isSponsored: boolean;
  attachment?: string;
  networkUrl: string;
}
export async function broadcastTransaction(options: BroadcastTransactionOptions) {
  const { txRaw, serialized, isSponsored, attachment, networkUrl } = options;
  if (isSponsored) return { txRaw };
  const response = await broadcastRawTransaction(
    serialized,
    `${networkUrl}/v2/transactions`,
    attachment ? Buffer.from(attachment, 'hex') : undefined
  );

  if (typeof response === 'string') {
    const isValidTxId = validateTxId(response);
    if (isValidTxId)
      return {
        txId: response,
        txRaw,
      };
    logger.error(`Error broadcasting raw transaction -- ${response}`);
    throw new Error(response);
  } else {
    logger.error('Error broadcasting raw transaction');
    const error = `${response.error} - ${response.reason}`;
    logger.error(error);
    throw new Error(error);
  }
}
