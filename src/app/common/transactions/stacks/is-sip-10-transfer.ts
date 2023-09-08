import { StacksTransaction } from '@stacks/transactions';

export function isSip10Transfer(tx: StacksTransaction) {
  if (!tx.payload || !('functionName' in tx.payload)) return false;
  const payload = tx.payload;
  return (
    payload.functionName.content === 'transfer' &&
    (payload.functionArgs.length === 3 || payload.functionArgs.length === 4)
  );
}
