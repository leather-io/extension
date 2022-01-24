import deepMerge from 'deepmerge';

import { logger } from '@shared/logger';
import type { initialKeysState } from '../keys/key.slice';

export function migrateVaultReducerStoreToNewStateStructure(initialState: typeof initialKeysState) {
  const salt = localStorage.getItem('stacks-wallet-salt');
  const encryptedSecretKey = localStorage.getItem('stacks-wallet-encrypted-key');
  if (salt && encryptedSecretKey) {
    logger.debug(
      'VaultReducer generated Hiro Wallet detected. Running migrating to keys store structure'
    );
    const migratedState = {
      ids: ['default'],
      entities: {
        default: {
          type: 'software',
          id: 'default',
          encryptedSecretKey,
          salt,
          hasSetPassword: true,
        },
      },
    };
    localStorage.removeItem('stacks-wallet-salt');
    localStorage.removeItem('stacks-wallet-encrypted-key');
    return deepMerge(initialState, migratedState);
  }
  return initialState;
}
