import { encryptMnemonic } from '@background/crypto/mnemonic-encryption';
import { getDecryptedWalletDetails } from '@background/wallet/unlock-wallet';

import { AppThunk } from '../root-reducer';
import { keySlice, selectCurrentKey, selectGeneratedSecretKey } from './key.slice';

export const setWalletEncryptionPassword = (password: string): AppThunk => {
  return async (dispatch, getState) => {
    const secretKey = selectGeneratedSecretKey(getState());
    if (!secretKey) throw new Error('Cannot generate wallet without first having generated a key');
    const { encryptedSecretKey, salt } = await encryptMnemonic({ secretKey, password });
    dispatch(
      keySlice.actions.addNewKey({
        type: 'software',
        id: 'default',
        salt,
        hasSetPassword: true,
        secretKey,
        encryptedSecretKey,
      })
    );
  };
};

export const unlockWalletAction = (password: string): AppThunk => {
  return async (dispatch, getState) => {
    const currentKey = selectCurrentKey(getState());
    if (!currentKey) return;
    const { encryptedSecretKey, salt } = currentKey;
    const vault = await getDecryptedWalletDetails(encryptedSecretKey, password, salt);
    dispatch(keySlice.actions.updateCurrentWallet({ id: 'default', changes: { ...vault } }));
  };
};
