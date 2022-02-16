import { useUnsignedPrepareTransactionDetails } from '@app/store/transactions/transaction.hooks';

export function useUnsignedTransactionFee() {
  const unsignedTx = useUnsignedPrepareTransactionDetails();

  const value = unsignedTx?.fee;
  const isSponsored = unsignedTx?.isSponsored;

  return { value, isSponsored };
}
