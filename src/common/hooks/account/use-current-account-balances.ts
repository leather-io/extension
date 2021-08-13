import { useAtomValue } from 'jotai/utils';
import { currentAccountBalancesState, currentAccountInfoState } from '@store/accounts';

export function useCurrentAccountBalances() {
  return useAtomValue(currentAccountBalancesState);
}

export function useCurrentAccountInfo() {
  return useAtomValue(currentAccountInfoState);
}
