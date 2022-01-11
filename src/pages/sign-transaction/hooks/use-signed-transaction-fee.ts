import { useSignedTransaction } from '@store/transactions/transaction.hooks';

/** @deprecated */
export function useSignedTransactionFee() {
  const signedTx = useSignedTransaction();

  const value = signedTx?.fee;
  const isSponsored = signedTx?.isSponsored;

  return { value, isSponsored };
}
