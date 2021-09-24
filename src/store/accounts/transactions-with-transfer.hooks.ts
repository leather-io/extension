import { useAtom } from 'jotai';
import { accountTransactionsWithTransfersState } from './transactions';

export function useAccountTransactionsWithTransfersState() {
  return useAtom(accountTransactionsWithTransfersState);
}
