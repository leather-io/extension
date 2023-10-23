import deepMerge from 'deepmerge';

import { logger } from '@shared/logger';

import type { initialKeysState } from '../software-keys/software-key.slice';

const hiroWalletSalt = 'stacks-wallet-salt';
const hiroWalletEncryptionKey = 'stacks-wallet-encrypted-key';

export function migrateVaultReducerStoreToNewStateStructure(initialState: typeof initialKeysState) {
  const salt = localStorage.getItem(hiroWalletSalt);
  const encryptedSecretKey = localStorage.getItem(hiroWalletEncryptionKey);

  if (salt && encryptedSecretKey) {
    logger.debug(
      'VaultReducer generated Leather detected. Running migration to keys store structure'
    );
    const migratedState = {
      ids: ['default'],
      entities: {
        default: {
          type: 'software',
          id: 'default',
          encryptedSecretKey,
          salt,
        },
      },
    };
    localStorage.removeItem(hiroWalletSalt);
    localStorage.removeItem(hiroWalletEncryptionKey);
    return deepMerge(initialState, migratedState);
  }
  return initialState;
}
