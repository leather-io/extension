import { useSelector } from 'react-redux';

import { RootState } from '@app/store';

import { submittedTransactionsAdapter } from './submitted-transactions.slice';

const submittedTransactionsSelectors = submittedTransactionsAdapter.getSelectors<RootState>(
  state => state.submittedTransactions
);

export function useSubmittedTransactions() {
  return useSelector(submittedTransactionsSelectors.selectAll);
}
