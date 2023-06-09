import { PersistConfig, createMigrate, getStoredState } from 'redux-persist';

import type { RootState } from '@app/store';

import { analytics } from '../utils/analytics';

export async function clearChromeStorage(): Promise<void> {
  return new Promise(resolve => chrome.storage.local.clear(resolve));
}

const driverMap = new WeakMap();
const runtimeMap = new WeakMap();

class ExtensionStorage {
  constructor(driver: any, runtime: any) {
    driverMap.set(this, driver);
    runtimeMap.set(this, runtime);
  }

  getDriver(): chrome.storage.StorageArea {
    return driverMap.get(this);
  }

  hasError() {
    return !!this.getError();
  }

  getError(): string | undefined {
    return runtimeMap.get(this).lastError;
  }

  setItem(key: string, item: any) {
    return new Promise((resolve, reject) => {
      this.getDriver().set({ [key]: item }, () => {
        if (this.hasError()) {
          return reject(this.getError());
        }
        return resolve(true);
      });
    });
  }

  getItem(key: string) {
    return new Promise((resolve, reject) => {
      this.getDriver().get(key, (response: any) => {
        if (this.hasError()) {
          return reject(this.getError());
        }
        return resolve(response[key]);
      });
    });
  }

  removeItem(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getDriver().remove(key, () => {
        if (this.hasError()) {
          return reject(this.getError());
        }
        return resolve(true);
      });
    });
  }
}
const storage = new ExtensionStorage(chrome.storage.local, chrome.runtime);

// Previously we used redux-persist's serialization feature. As `chrome.storage`
// doesn't require data to be serialized, we can disable that feature, however
// it requires a migration.
// Disabling it has a few benefits:
// - We rely less on redux-persist's implementation details, such as to parse the store
// - We can more easily read store data in the background script
// - We can more easily declare default wallet state for use in tests
const legacyPersistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage,
  serialize: true,
  whitelist: ['analytics', 'chains', 'keys', 'networks', 'onboarding', 'settings'],
};

async function migrateToUsingNoSerialization() {
  const storageVal = (await new Promise(resolve =>
    chrome.storage.local.get(['persist:root'], resolve)
  )) as any;

  if (!storageVal) return undefined;

  const store = storageVal['persist:root'];

  if (typeof store === 'string') {
    void analytics.track('redux_persist_migration_to_no_serialization');
    return getStoredState(legacyPersistConfig);
  }

  return storage;
}

interface UntypedDeserializeOption {
  deserialize?: boolean;
}
export const persistConfig: PersistConfig<RootState> & UntypedDeserializeOption = {
  key: 'root',
  version: 1,
  storage,
  serialize: false,
  migrate: createMigrate({
    0: async () => {
      return migrateToUsingNoSerialization();
    },
  } as any),
  deserialize: false,
  whitelist: [
    'analytics',
    'chains',
    'ordinals',
    'keys',
    'ledger',
    'networks',
    'onboarding',
    'settings',
  ],
};
