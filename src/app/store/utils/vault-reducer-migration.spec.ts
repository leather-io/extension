import { LocalStorageMock } from '@tests-legacy/mocks/localStorage-mock';
import { vi } from 'vitest';

import { defaultKeyId } from '../keys/key.slice';
import { migrateVaultReducerStoreToNewStateStructure } from './vault-reducer-migration';

(globalThis as any).localStorage = new LocalStorageMock();

describe(migrateVaultReducerStoreToNewStateStructure.name, () => {
  describe('no migration needed scenario', () => {
    test('nothing happens when no localStorage values are detected', () => {
      const returnedValue = migrateVaultReducerStoreToNewStateStructure({} as any);
      expect(returnedValue).toEqual({});
    });
  });

  describe('migration scenario', () => {
    beforeEach(() => {
      localStorage.setItem('stacks-wallet-salt', 'test-salt');
      localStorage.setItem('stacks-wallet-encrypted-key', 'test-encrypted-key');
    });

    test('that it reads localstorage wallet values', () => {
      vi.spyOn(global.localStorage.__proto__, 'getItem');

      migrateVaultReducerStoreToNewStateStructure({} as any);

      expect(localStorage.getItem).toHaveBeenCalledWith('stacks-wallet-salt');
      expect(localStorage.getItem).toHaveBeenCalledWith('stacks-wallet-encrypted-key');
    });

    test('that it returns a migrated state object when wallet values are detected', () => {
      const returnedValue = migrateVaultReducerStoreToNewStateStructure({} as any);
      expect(returnedValue).toEqual({
        ids: [defaultKeyId],
        entities: {
          [defaultKeyId]: {
            type: 'software',
            id: defaultKeyId,
            encryptedSecretKey: 'test-encrypted-key',
            salt: 'test-salt',
          },
        },
      });
    });

    test('it removes the existing localStorage values', () => {
      vi.spyOn(global.localStorage.__proto__, 'removeItem');
      migrateVaultReducerStoreToNewStateStructure({} as any);
      expect(localStorage.removeItem).toHaveBeenCalledWith('stacks-wallet-salt');
      expect(localStorage.removeItem).toHaveBeenCalledWith('stacks-wallet-encrypted-key');
    });
  });
});
