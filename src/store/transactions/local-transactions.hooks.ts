import { useAtom } from 'jotai';
import { localStxTransactionAmountState } from '@store/transactions/local-transactions';

export function useLocalStxTransactionAmount() {
  return useAtom(localStxTransactionAmountState);
}
