import {
  currentAccountBalancesUnanchoredState,
  currentAccountConfirmedTransactionsState,
  currentAccountMempoolTransactionsState,
} from '@store/accounts';
import { useAtomValue } from 'jotai/utils';

export const useFetchAccountData = () => {
  const balances = useAtomValue(currentAccountBalancesUnanchoredState);
  const pendingTransactions = useAtomValue(currentAccountMempoolTransactionsState);
  const transactions = useAtomValue(currentAccountConfirmedTransactionsState);
  if (!balances) throw new Error('is the user signed in?');
  return {
    balances,
    pendingTransactions,
    transactions,
  };
};

export const useFetchBalances = () => {
  return useAtomValue(currentAccountBalancesUnanchoredState);
};
