import { AppThunk } from '@app/store';

import { selectDefaultWalletKey } from '../in-memory-key/in-memory-key.selectors';
import { stxChainSlice } from './stx-chain.slice';

export function createNewAccount(): AppThunk {
  return async (dispatch, getState) => {
    const secretKey = selectDefaultWalletKey(getState());
    if (!secretKey) {
      throw new Error('Unable to create a new account. Wallet not signed in');
    }
    dispatch(stxChainSlice.actions.createNewAccount());
  };
}

export const stxChainActions = stxChainSlice.actions;
