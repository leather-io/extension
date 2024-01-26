import {
  connectToGaiaHubWithConfig,
  fetchWalletConfig,
  generateWallet,
  getHubInfo,
} from '@stacks/wallet-sdk';

import { gaiaUrl as gaiaHubUrl } from '@shared/constants';

// This function repliactes behaviour  wrapped in the `restoreWalletAccounts`
// method of wallet-sdk. It checks for BNS names on Gaia-persisted accounts,
// resulting in a huge number of requests when called by a wallet with many
// accounts. Here, we only care to find the number of accounts a user has
// generated, with no other side effects.
export async function checkForLegacyGaiaConfigWithKnownGeneratedAccountIndex(secretKey: string) {
  try {
    const wallet = await generateWallet({ secretKey, password: '' });
    const hubInfo = await getHubInfo(gaiaHubUrl);
    const currentGaiaConfig = connectToGaiaHubWithConfig({
      hubInfo,
      privateKey: wallet.configPrivateKey,
      gaiaHubUrl,
    });
    const resp = await fetchWalletConfig({ wallet, gaiaHubConfig: currentGaiaConfig });
    return resp?.accounts.length ? resp.accounts.length - 1 : 0;
  } catch (e) {
    return 0;
  }
}
