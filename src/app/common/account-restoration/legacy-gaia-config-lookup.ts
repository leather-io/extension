import { StacksMainnet } from '@stacks/network';
import { generateWallet, restoreWalletAccounts } from '@stacks/wallet-sdk';

import { gaiaUrl } from '@shared/constants';

export async function checkForLegacyGaiaConfigWithKnownGeneratedAccountIndex(secretKey: string) {
  try {
    // Don't need, nor return, encrypted wallet value, so a legit password isn't
    // needed. Ideally `@stacks/wallet-sdk` should be updated so that the encrypt
    // function is a separate method
    const wallet = await generateWallet({ secretKey, password: '' });
    const network = new StacksMainnet();
    const restoredWallet = await restoreWalletAccounts({ wallet, gaiaHubUrl: gaiaUrl, network });
    return restoredWallet.accounts.length - 1;
  } catch (e) {
    return 0;
  }
}
