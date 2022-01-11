import {
  createWalletGaiaConfig,
  generateNewAccount,
  generateSecretKey,
  generateWallet,
  restoreWalletAccounts,
  updateWalletConfig,
  Wallet as SDKWallet,
} from '@stacks/wallet-sdk';

import type { VaultActions } from '@background/vault-types';
import { decryptMnemonic, encryptMnemonic } from '@background/crypto/mnemonic-encryption';
import { gaiaUrl } from '@common/constants';
import { DEFAULT_PASSWORD } from '@common/types';
import { InternalMethods } from '@common/message-types';
import { logger } from '@common/logger';
import { getHasSetPassword, hasSetPasswordIdentifier } from '@common/storage';

// In-memory (background) wallet instance
export interface InMemoryVault {
  encryptedSecretKey?: string;
  salt?: string;
  secretKey?: string;
  wallet?: SDKWallet;
  currentAccountIndex?: number;
  hasSetPassword: boolean;
}

const encryptedKeyIdentifier = 'stacks-wallet-encrypted-key' as const;
const saltIdentifier = 'stacks-wallet-salt' as const;

const defaultVault: InMemoryVault = {
  encryptedSecretKey: undefined,
  hasSetPassword: false,
  salt: undefined,
} as const;

let inMemoryVault: InMemoryVault = {
  ...defaultVault,
  encryptedSecretKey: localStorage.getItem(encryptedKeyIdentifier) || undefined,
  hasSetPassword: getHasSetPassword(),
  salt: localStorage.getItem(saltIdentifier) || undefined,
};

function persistOptional(storageKey: string, value?: string) {
  if (value) {
    localStorage.setItem(storageKey, value);
  } else {
    localStorage.removeItem(storageKey);
  }
}

export async function vaultMessageHandler(message: VaultActions) {
  inMemoryVault = await vaultReducer(message);
  persistOptional(encryptedKeyIdentifier, inMemoryVault.encryptedSecretKey);
  persistOptional(saltIdentifier, inMemoryVault.salt);
  localStorage.setItem(hasSetPasswordIdentifier, JSON.stringify(inMemoryVault.hasSetPassword));
  return inMemoryVault;
}

async function storeSeed(secretKey: string, password?: string): Promise<InMemoryVault> {
  const pw = password || DEFAULT_PASSWORD;
  const generatedWallet = await generateWallet({
    secretKey,
    password: pw,
  });
  const hasSetPassword = password !== undefined;
  const keyInfo = {
    secretKey,
    encryptedSecretKey: inMemoryVault.encryptedSecretKey,
    currentAccountIndex: 0,
    hasSetPassword,
  };
  // This method is called on `unlockWallet`.
  // `restoreWalletAccounts` is reliant on external resources.
  // If this method fails, we return a single wallet instance,
  // the root wallet.
  try {
    const _wallet = await restoreWalletAccounts({
      wallet: generatedWallet,
      gaiaHubUrl: gaiaUrl,
    });
    return { ...inMemoryVault, ...keyInfo, wallet: _wallet };
  } catch (error) {
    return { ...inMemoryVault, ...keyInfo, wallet: generatedWallet };
  }
}

// Ensure that TS will flag unhandled messages and will throw at runtime
function throwUnhandledMethod(message: never): never;
function throwUnhandledMethod(message: VaultActions) {
  throw new Error(`Unhandled message: ${JSON.stringify(message, null, 2)}`);
}

// Reducer to manage the state of the vault
const vaultReducer = async (message: VaultActions): Promise<InMemoryVault> => {
  switch (message.method) {
    case InternalMethods.getWallet:
      return {
        ...inMemoryVault,
      };
    case InternalMethods.makeWallet: {
      const secretKey = generateSecretKey(256);
      const _wallet = await generateWallet({ secretKey, password: DEFAULT_PASSWORD });
      return {
        ...inMemoryVault,
        secretKey,
        wallet: _wallet,
        currentAccountIndex: 0,
      };
    }
    case InternalMethods.storeSeed: {
      const { secretKey, password } = message.payload;
      return storeSeed(secretKey, password);
    }
    case InternalMethods.createNewAccount: {
      const { secretKey, wallet } = inMemoryVault;
      if (!secretKey || !wallet) {
        throw 'Unable to create a new account - not logged in.';
      }
      const newWallet = generateNewAccount(wallet);
      // Attempt to update gaia config with new account information
      // If Gaia fails, return new account information anyway
      try {
        const updateConfig = async () => {
          const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
          await updateWalletConfig({
            wallet: newWallet,
            gaiaHubConfig,
          });
        };
        await updateConfig();
      } catch (e) {
        logger.error('Unable to update Gaia profile', e);
      }
      return {
        ...inMemoryVault,
        wallet: newWallet,
        currentAccountIndex: newWallet.accounts.length - 1,
      };
    }
    case InternalMethods.signOut: {
      return {
        ...defaultVault,
      };
    }
    case InternalMethods.setPassword: {
      const { payload: password } = message;
      const { secretKey } = inMemoryVault;
      if (!secretKey) {
        throw new Error('Cannot set password - not logged in.');
      }
      const { encryptedSecretKey, salt } = await encryptMnemonic({ secretKey, password });
      return {
        ...inMemoryVault,
        encryptedSecretKey,
        salt,
        hasSetPassword: true,
      };
    }
    case InternalMethods.unlockWallet: {
      const { payload: password } = message;
      const { encryptedSecretKey, salt } = inMemoryVault;
      if (!encryptedSecretKey) {
        throw new Error('Unable to unlock - logged out.');
      }
      const decryptedData = await decryptMnemonic({
        encryptedSecretKey,
        password,
        salt,
      });
      const newVault = await storeSeed(decryptedData.secretKey, password);
      return {
        ...newVault,
        salt: decryptedData.salt,
        encryptedSecretKey: decryptedData.encryptedSecretKey,
      };
    }
    case InternalMethods.lockWallet: {
      return {
        ...inMemoryVault,
        wallet: undefined,
        secretKey: undefined,
      };
    }
    case InternalMethods.switchAccount: {
      const { wallet } = inMemoryVault;
      const newIndex = message.payload;
      const accountNumber = (newIndex as number) + 1;
      if (!wallet || wallet.accounts.length < accountNumber) {
        throw new Error(
          `Cannot switch to account ${accountNumber}, only ${wallet?.accounts.length} accounts.`
        );
      }
      return {
        ...inMemoryVault,
        currentAccountIndex: newIndex,
      };
    }
    default:
      throwUnhandledMethod(message);
  }
};
