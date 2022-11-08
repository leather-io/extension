import deepMerge from 'deepmerge';

import { logger } from '@shared/logger';

import type { initialKeysState } from '../keys/key.slice';

const hiroWalletSalt = 'stacks-wallet-salt';
const hiroWalletEncryptionKey = 'stacks-wallet-encrypted-key';

export function migrateVaultReducerStoreToNewStateStructure(initialState: typeof initialKeysState) {
  const salt = localStorage.getItem(hiroWalletSalt);
  const encryptedSecretKey = localStorage.getItem(hiroWalletEncryptionKey);

  if (salt && encryptedSecretKey) {
    logger.debug(
      'VaultReducer generated Hiro Wallet detected. Running migration to keys store structure'
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
    return deepMerge(initialState, migratedState);
  }
  return initialState;
}
