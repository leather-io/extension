import { useAsync } from 'react-async-hook';
import { useSelector } from 'react-redux';
import {
  createWalletGaiaConfig,
  generateNewAccount,
  generateWallet,
  updateWalletConfig,
  Wallet,
} from '@stacks/wallet-sdk';

import { gaiaUrl } from '@shared/constants';
import { logger } from '@shared/logger';
import { saveWalletConfigLocally } from '@shared/utils/wallet-config-helper';
import memoize from 'promise-memoize';

import { selectCurrentKey, useCurrentKey } from '../keys/key.slice';
import { AppThunk } from '../root-reducer';
import { selectStxChain, stxChainSlice } from './stx-chain.slice';

export const createNewAccount = (wallet: Wallet): AppThunk => {
  return async (dispatch, getState) => {
    const currentKey = selectCurrentKey(getState());
    if (!currentKey) return;
    const { secretKey } = currentKey;
    if (!secretKey) {
      throw new Error('Unable to create a new account - not logged in.');
    }
    const newWallet = generateNewAccount(wallet);
    // Attempt to update gaia config with new account information
    // If Gaia fails, return new account information anyway
    try {
      const updateConfig = async () => {
        const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
        const walletConfig = await updateWalletConfig({ wallet: newWallet, gaiaHubConfig });
        // The gaia wallet config is saved locally so we don't have
        // to fetch it again from gaia on wallet unlock
        saveWalletConfigLocally(walletConfig);
      };
      await updateConfig();
    } catch (e) {
      logger.error('Unable to update Gaia profile', e);
    }
    dispatch(stxChainSlice.actions.createNewAccount());
  };
};

export const deriveWalletWithAccounts = memoize(
  async (secretKey: string, highestAccountIndex: number) => {
    // Here we only want the resulting `Wallet` objects, but the API
    // requires a password (so it can also return an encrypted key)
    const walletSdk = await generateWallet({ secretKey, password: '' });
    // To generate a new account, the wallet-sdk requires the entire `Wallet` to
    // be supplied so that it can count the `wallet.accounts[]` length, and return
    // a new `Wallet` object with all the accounts. As we want to generate them
    // all, we must set the updated value and read it again in the loop
    let walWithAccounts = walletSdk;
    for (let i = 0; i < highestAccountIndex; i++) {
      walWithAccounts = generateNewAccount(walWithAccounts);
    }
    return walWithAccounts;
  }
);

export function useGeneratedCurrentWallet() {
  const currAccount = useCurrentKey();
  const stxChainState = useSelector(selectStxChain);
  return useAsync(async () => {
    if (!currAccount) return undefined;
    return deriveWalletWithAccounts(
      currAccount.secretKey,
      stxChainState.default.highestAccountIndex
    );
  }, [currAccount, stxChainState]).result;
}
