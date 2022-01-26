import { generateWallet, restoreWalletAccounts } from '@stacks/wallet-sdk';

import { decryptMnemonic, encryptMnemonic } from '@shared/crypto/mnemonic-encryption';
import { gaiaUrl } from '@shared/constants';
import { AppThunk } from '@app/store';

import { stxChainSlice } from '../chains/stx-chain.slice';
import { keySlice } from './key.slice';
import { selectCurrentKey, selectGeneratedSecretKey } from './key.selectors';
import { sendMessage } from '@shared/messages';
import { InternalMethods } from '@shared/message-types';
import { inMemoryKeySlice } from '../in-memory-key/in-memory-key.slice';

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

const setWalletEncryptionPassword = (password: string): AppThunk => {
  return async (dispatch, getState) => {
    const secretKey = selectGeneratedSecretKey(getState());
    if (!secretKey) throw new Error('Cannot generate wallet without first having generated a key');
    const { encryptedSecretKey, salt } = await encryptMnemonic({ secretKey, password });
    const highestAccountIndex = await restoredWalletHighestGeneratedAccountIndex(secretKey);

    sendMessage({
      method: InternalMethods.ShareInMemoryKeyToBackground,
      payload: { secretKey, keyId: 'default' },
    });

    dispatch(inMemoryKeySlice.actions.setKeysInMemory({ default: secretKey }));

    dispatch(
      keySlice.actions.createNewWalletComplete({
        type: 'software',
        id: 'default',
        salt,
        encryptedSecretKey,
      })
    );
    if (highestAccountIndex !== 0)
      dispatch(stxChainSlice.actions.restoreAccountIndex(highestAccountIndex));
  };
};

const unlockWalletAction = (password: string): AppThunk => {
  return async (dispatch, getState) => {
    const currentKey = selectCurrentKey(getState());
    if (!currentKey) return;
    const { encryptedSecretKey, salt } = currentKey;
    const decryptedData = await decryptMnemonic({ encryptedSecretKey, password, salt });

    sendMessage({
      method: InternalMethods.ShareInMemoryKeyToBackground,
      payload: { secretKey: decryptedData.secretKey, keyId: 'default' },
    });
    dispatch(inMemoryKeySlice.actions.setKeysInMemory({ default: decryptedData.secretKey }));
    dispatch(keySlice.actions.unlockWalletComplete(decryptedData));
  };
};

export const keyActions = { ...keySlice.actions, setWalletEncryptionPassword, unlockWalletAction };
