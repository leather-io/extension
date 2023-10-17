import { store } from '@app/store';

export function useHasStacksKeychain() {
  return Object.keys(store.getState().keys.entities).length > 0;
}
