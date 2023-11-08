import { useSelector } from 'react-redux';

import { atom, useAtom } from 'jotai';

import { selectCurrentAccountIndex } from '../software-keys/software-key.selectors';

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom(false);

export function useCurrentAccountIndex() {
  return useSelector(selectCurrentAccountIndex);
}

export function useHasSwitchedAccounts() {
  return useAtom(hasSwitchedAccountsState);
}
