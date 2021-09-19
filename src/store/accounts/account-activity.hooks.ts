import { useAtomValue } from 'jotai/utils';
import {
  currentAccountAllTxIds,
  currentAccountLocallySubmittedStacksTransactionsState,
  currentAccountLocallySubmittedTxsState,
} from '@store/accounts/account-activity';
import { useAtom } from 'jotai';

export const useCurrentAccountTxids = () => {
  return useAtomValue(currentAccountAllTxIds);
};

export const useCurrentAccountLocalTxs = () => {
  return useAtom(currentAccountLocallySubmittedTxsState);
};

export const useCurrentAccountLocalStacksTransaction = (tx_id: string) => {
  const txs = useAtomValue(currentAccountLocallySubmittedStacksTransactionsState);
  return txs[tx_id];
};
