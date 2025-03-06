import { stacksRootKeychainToAccountDescriptor } from '@leather.io/stacks';

import { AppThunk } from '@app/store';

import {
  selectDefaultWalletKey,
  selectRootKeychain,
} from '../in-memory-key/in-memory-key.selectors';
import { selectHighestAccountIndex } from './stx-chain.selectors';
import { stxChainSlice } from './stx-chain.slice';

export function initializeIndexZeroAccount(): AppThunk {
  return async (dispatch, getState) => {
    const state = getState();
    const keychain = selectRootKeychain(state);

    if (keychain) {
      const stacksDescriptor = stacksRootKeychainToAccountDescriptor(keychain, 0);
      dispatch(
        stxChainSlice.actions.initializeAccount({
          highestAccountIndex: 0,
          currentAccountIndex: 0,
          currentAccountStacksDescriptor: stacksDescriptor,
        })
      );
    }
  };
}

export function switchAccount(accountIndex: number): AppThunk {
  return async (dispatch, getState) => {
    const state = getState();
    const keychain = selectRootKeychain(state);
    if (keychain) {
      const stacksDescriptor = stacksRootKeychainToAccountDescriptor(keychain, accountIndex);
      dispatch(stxChainSlice.actions.switchAccount({ accountIndex, stacksDescriptor }));
      return;
    }
    dispatch(stxChainSlice.actions.switchAccount({ accountIndex }));
  };
}

export function createNewAccount(): AppThunk {
  return async (dispatch, getState) => {
    const state = getState();
    const secretKey = selectDefaultWalletKey(state);
    if (!secretKey) throw new Error('Unable to create a new account. Wallet not signed in');
    const keychain = selectRootKeychain(state);
    const highestIndex = selectHighestAccountIndex(state);
    if (!keychain) throw new Error('No root keychain found');
    const stacksDescriptor = stacksRootKeychainToAccountDescriptor(keychain, highestIndex + 1);
    dispatch(stxChainSlice.actions.createNewAccount(stacksDescriptor));
  };
}
