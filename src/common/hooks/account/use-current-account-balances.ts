import { useAtomValue } from 'jotai/utils';
import { currentAccountBalancesUnanchoredState, currentAccountInfoState } from '@store/accounts';

export function useCurrentAccountBalances() {
  return useAtomValue(currentAccountBalancesUnanchoredState);
}

export function useCurrentAccountInfo() {
  return useAtomValue(currentAccountInfoState);
}
