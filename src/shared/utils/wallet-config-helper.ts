import { WalletConfig } from '@stacks/wallet-sdk';
import { Wallet, createWalletGaiaConfig, getOrCreateWalletConfig } from '@stacks/wallet-sdk';

import { gaiaUrl } from '@shared/constants';
import { logger } from '@shared/logger';
import { setToLocalstorageIfDefined } from '@shared/utils/storage';

export function saveWalletConfigLocally(walletConfig: WalletConfig) {
  setToLocalstorageIfDefined('walletConfig', JSON.stringify(walletConfig));
  return walletConfig;
}

export async function getWalletConfig(wallet: Wallet) {
  try {
    const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
    const walletConfig = await getOrCreateWalletConfig({
      wallet,
      gaiaHubConfig,
      skipUpload: true,
    });
    saveWalletConfigLocally(walletConfig);
    return walletConfig;
  } catch (e) {
    logger.error('useWalletConfig error', e);
    return;
  }
}
