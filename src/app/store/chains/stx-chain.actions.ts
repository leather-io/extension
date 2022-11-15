import {
  Wallet,
  createWalletGaiaConfig,
  generateNewAccount,
  updateWalletConfig,
} from '@stacks/wallet-sdk';

import { gaiaUrl } from '@shared/constants';
import { logger } from '@shared/logger';
import { saveWalletConfigLocally } from '@shared/utils/wallet-config-helper';

import { AppThunk } from '@app/store';

import { selectDefaultWalletKey } from '../in-memory-key/in-memory-key.selectors';
import { stxChainSlice } from './stx-chain.slice';

export const createNewAccount = (wallet: Wallet): AppThunk => {
  return async (dispatch, getState) => {
    const secretKey = selectDefaultWalletKey(getState());
    if (!secretKey) {
      throw new Error('Unable to create a new account. Wallet not signed in');
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

export const stxChainActions = stxChainSlice.actions;
