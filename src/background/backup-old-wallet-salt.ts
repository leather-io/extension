import { logger } from '@shared/logger';
import { gaiaUrl } from '@shared/constants';
import { createWalletGaiaConfig, generateWallet } from '@stacks/wallet-sdk';
import { GaiaHubConfig, uploadToGaiaHub } from '@stacks/storage';
import { decryptContent, encryptContent, getPublicKeyFromPrivate } from '@stacks/encryption';

const walletSaltBackup = 'wallet-salt-backup';

export function backupOldWalletSalt() {
  const salt = localStorage.getItem('stacks-wallet-salt');
  // Save the previous wallet salt to later store on gaia encrypted
  if (salt !== null) localStorage.setItem(walletSaltBackup, salt);
}

interface WalletDataMigrationConfig {
  version: string;
  walletSaltThatGeneratesIncorrectAppKey: string;
  meta?: {
    [key: string]: any;
  };
}

async function fetchWalletMigrationData({
  configPrivateKey,
  gaiaHubConfig,
}: {
  configPrivateKey: string;
  gaiaHubConfig: GaiaHubConfig;
}) {
  try {
    const response = await fetch(
      `${gaiaHubConfig.url_prefix}${gaiaHubConfig.address}/wallet-migration-data.json`
    );
    if (!response.ok) return null;
    const encrypted = await response.text();
    const configJSON = (await decryptContent(encrypted, {
      privateKey: configPrivateKey,
    })) as string;
    const config: WalletDataMigrationConfig = JSON.parse(configJSON);
    return config;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

const walletMigrationFilename = 'wallet-migration-data.json';
const walletMigrationVersion = '1.0';

async function storeToGaia(
  configPrivateKey: string,
  gaiaHubConfig: GaiaHubConfig,
  walletSaltThatGeneratesIncorrectAppKey: string
) {
  const migrationData: WalletDataMigrationConfig = {
    version: walletMigrationVersion,
    walletSaltThatGeneratesIncorrectAppKey,
  };
  const publicKey = getPublicKeyFromPrivate(configPrivateKey);
  const encrypted = await encryptContent(JSON.stringify(migrationData), { publicKey });
  try {
    await uploadToGaiaHub(
      walletMigrationFilename,
      encrypted,
      gaiaHubConfig,
      undefined,
      undefined,
      undefined,
      true
    );
  } catch (e) {
    logger.error(e);
    return;
  }
  return migrationData;
}

const saltUsedInAppKeyInGaia = 'salt-used-in-app-key-in-gaia';

export async function backupWalletSaltForGaia(secretKey: string) {
  // If we already stored in gaia and fetched it, just look up localStorage
  // We did not do the migration yet, check if previous salt (before this release) is in localStorage
  const localSalt = localStorage.getItem(walletSaltBackup);
  const wallet = await generateWallet({ secretKey, password: '' });

  if (localStorage.getItem(saltUsedInAppKeyInGaia)) return;
  if (!wallet) return;
  const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
  if (localSalt) {
    const migrationData = await storeToGaia(wallet.configPrivateKey, gaiaHubConfig, localSalt);
    if (!migrationData) return;
    localStorage.setItem(saltUsedInAppKeyInGaia, localSalt);
    return localSalt;
  }
  // Fetch Gaia wallet migration data file
  const migrationData = await fetchWalletMigrationData({
    configPrivateKey: wallet.configPrivateKey,
    gaiaHubConfig,
  });
  if (!migrationData) return;
  // Store salt in localStorage so we don't have to fetch Gaia again and that salt is never updated again
  localStorage.setItem(
    saltUsedInAppKeyInGaia,
    migrationData.walletSaltThatGeneratesIncorrectAppKey
  );
  return migrationData.walletSaltThatGeneratesIncorrectAppKey;
}
