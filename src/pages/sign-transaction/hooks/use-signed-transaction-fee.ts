import { useSignedTransaction } from '@store/transactions/transaction.hooks';

export function useSignedTransactionFee() {
  const signedTx = useSignedTransaction();

  const value = signedTx?.fee;
  const isSponsored = signedTx?.isSponsored;

  return { value, isSponsored };
}
