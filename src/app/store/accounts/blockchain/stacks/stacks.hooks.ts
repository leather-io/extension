import { store } from '@app/store';

export function useHasStacksLedgerKeychain() {
  return Object.keys(store.getState().ledger.stacks.entities).length > 0;
}
