import { useTransactionRequestCustomFee } from '@store/transactions/requests.hooks';
import { useSignedTransaction } from '@store/transactions/transaction.hooks';

export function useTransactionFee() {
  const signedTx = useSignedTransaction();
  const customFee = useTransactionRequestCustomFee();

  const amount = customFee || signedTx?.fee;
  const isSponsored = signedTx?.isSponsored;

  return { amount, isSponsored };
}
