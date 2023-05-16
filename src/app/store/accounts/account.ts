import { useSelector } from 'react-redux';

import { atom, useAtom } from 'jotai';

import { selectCurrentAccountIndex } from '../keys/key.selectors';

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom(false);

const hasCreatedAccountState = atom<boolean>(false);

export function useCurrentAccountIndex() {
  return useSelector(selectCurrentAccountIndex);
}

export function useHasSwitchedAccounts() {
  return useAtom(hasSwitchedAccountsState);
}

export function useHasCreatedAccount() {
  return useAtom(hasCreatedAccountState);
}
