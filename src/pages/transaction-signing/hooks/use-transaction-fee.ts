import { useSignedTransaction } from '@store/transactions/transaction.hooks';

export function useTransactionFee() {
  const signedTx = useSignedTransaction();
  const amount = signedTx?.fee;
  const isSponsored = signedTx?.isSponsored;

  return { amount, isSponsored };
}
