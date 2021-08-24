import {
  useCurrentAccountConfirmedTransactionsState,
  useCurrentAccountMempoolTransactionsState,
  useCurrentAccountBalancesUnanchoredState,
} from '@store/accounts/account.hooks';

export const useFetchAccountData = () => {
  const balances = useCurrentAccountBalancesUnanchoredState();
  const pendingTransactions = useCurrentAccountMempoolTransactionsState();
  const transactions = useCurrentAccountConfirmedTransactionsState();
  if (!balances) throw new Error('is the user signed in?');
  return {
    balances,
    pendingTransactions,
    transactions,
  };
};
