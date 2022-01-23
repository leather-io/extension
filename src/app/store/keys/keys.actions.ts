import { encryptMnemonic } from '@background/crypto/mnemonic-encryption';
import { getDecryptedWalletDetails } from '@background/wallet/unlock-wallet';
import { gaiaUrl } from '@shared/constants';
import { generateWallet, restoreWalletAccounts } from '@stacks/wallet-sdk';
import { stxChainSlice } from '../chains/stx-chain.slice';

import { AppThunk } from '../root-reducer';
import { keySlice, selectCurrentKey, selectGeneratedSecretKey } from './key.slice';

async function restoredWalletHighestGeneratedAccountIndex(secretKey: string) {
  try {
    // Don't need, nor return, encrypted wallet value, so a legit password isn't
    // needed. Ideally `@stacks/wallet-sdk` should be updated so that the encrypt
    // function is a separate method
    const wallet = await generateWallet({ secretKey, password: '' });
    const restoredWallet = await restoreWalletAccounts({
      wallet,
      gaiaHubUrl: gaiaUrl,
    });
    return restoredWallet.accounts.length - 1;
  } catch (e) {
    return 0;
  }
}

export const setWalletEncryptionPassword = (password: string): AppThunk => {
  return async (dispatch, getState) => {
    const secretKey = selectGeneratedSecretKey(getState());
    if (!secretKey) throw new Error('Cannot generate wallet without first having generated a key');
    const { encryptedSecretKey, salt } = await encryptMnemonic({ secretKey, password });
    const highestAccountIndex = await restoredWalletHighestGeneratedAccountIndex(secretKey);
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
    if (highestAccountIndex !== 0)
      dispatch(stxChainSlice.actions.restoreAccountIndex(highestAccountIndex));
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
