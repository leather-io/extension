import { useAtomValue } from 'jotai/utils';
import { currentAccountBalancesState, currentAccountInfoState } from '@store/accounts';

export function useAccountBalances() {
  return useAtomValue(currentAccountBalancesState);
}

export function useAccountInfo() {
  return useAtomValue(currentAccountInfoState);
}
