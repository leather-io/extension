import { setToLocalstorageIfDefined } from '@common/storage';
import { WalletConfig } from '@stacks/wallet-sdk';
import { createWalletGaiaConfig, getOrCreateWalletConfig, Wallet } from '@stacks/wallet-sdk';
import { gaiaUrl } from '@common/constants';
import { logger } from '@common/logger';

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
