import { decryptContent, encryptContent, getPublicKeyFromPrivate } from '@stacks/encryption';
import { createWalletGaiaConfig } from '@stacks/wallet-sdk';
import { useAsync } from 'react-async-hook';
import { fetchPrivate } from '@stacks/common';
import { gaiaUrl } from '@shared/constants';
import { useWalletState } from '@app/store/wallet/wallet.hooks';
import { logger } from '@shared/logger';
import { GaiaHubConfig, uploadToGaiaHub } from '@stacks/storage';

const saltUsedInAppKeyInGaia = 'salt-used-in-app-key-in-gaia';
const walletSaltBackup = 'wallet-salt-backup';

export function useBackupOldWalletSalt() {
  // If we already stored in gaia and fetched it, just look up localStorage
  // We did not do the migration yet, check if previous salt (before this release) is in localStorage
  const localSalt = localStorage.getItem(walletSaltBackup);
  const [wallet] = useWalletState();

  return useAsync(async () => {
    if (localStorage.getItem(saltUsedInAppKeyInGaia)) return;
    if (!wallet) return;
    const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
    if (localSalt) {
      await storeToGaia(wallet.configPrivateKey, gaiaHubConfig, localSalt);
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
    localStorage.setItem(saltUsedInAppKeyInGaia, migrationData.oldWalletSalt);
    return migrationData.oldWalletSalt;
  }, []).result;
}

interface WalletDataMigrationConfig {
  version: string;
  oldWalletSalt: string;
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
    const response = await fetchPrivate(
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
async function storeToGaia(configPrivateKey: string, gaiaHubConfig: GaiaHubConfig, salt: string) {
  const migrationData: WalletDataMigrationConfig = {
    version: walletMigrationVersion,
    oldWalletSalt: salt,
  };
  const publicKey = getPublicKeyFromPrivate(configPrivateKey);
  const encrypted = await encryptContent(JSON.stringify(migrationData), { publicKey });
  await uploadToGaiaHub(
    walletMigrationFilename,
    encrypted,
    gaiaHubConfig,
    undefined,
    undefined,
    undefined,
    true
  );
  return migrationData;
}
