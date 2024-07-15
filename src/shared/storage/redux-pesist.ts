import { PersistConfig, createMigrate, getStoredState } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { getStxDerivationPath } from '@shared/crypto/stacks/stacks.utils';
import { defaultWalletKeyId } from '@shared/utils';

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

function processStacksLedgerKeys(stacksKeys: any) {
  const newStacksKeys = stacksKeys.entities.default.publicKeys.reduce(
    (acc: { ids: string[]; entities: Record<string, any> }, item: any, index: number) => {
      const path = getStxDerivationPath(index);
      const id = path.replace('m', defaultWalletKeyId);

      acc.ids.push(id);
      acc.entities[id] = {
        ...item,
        path,
        id,
        walletId: 'default',
        targetId: '',
      };

      return acc;
    },
    { ids: [], entities: {} }
  );

  return newStacksKeys;
}

async function migrateToRenameKeysStoreModule(state: Promise<any>) {
  const resolvedState = await Promise.resolve(state);

  const newStore = {
    ...resolvedState,
    softwareKeys: resolvedState.keys,
    ledger: {
      ...resolvedState.ledger,
    },
  };

  // add stacks ledger keys to new place
  if (resolvedState.keys?.entities.default?.type === 'ledger') {
    newStore.ledger = {
      ...resolvedState.ledger,
      stacks: processStacksLedgerKeys(resolvedState.keys),
    };
  }

  // add default bitcoin ledger state
  if (!newStore.ledger.bitcoin) {
    newStore.ledger.bitcoin = {
      ids: [],
      entities: {},
    };
  }

  // add default stacks ledger state
  if (!newStore.ledger.stacks) {
    newStore.ledger.stacks = {
      ids: [],
      entities: {},
    };
  }

  // remove old keys store
  Reflect.deleteProperty(newStore, 'keys');

  return newStore;
}

interface UntypedDeserializeOption {
  deserialize?: boolean;
}
export const persistConfig: PersistConfig<RootState> & UntypedDeserializeOption = {
  key: 'root',
  stateReconciler: autoMergeLevel2,
  version: 2,
  storage,
  serialize: false,
  migrate: createMigrate({
    0: async () => {
      return migrateToUsingNoSerialization();
    },
    2: async (state: any) => {
      return migrateToRenameKeysStoreModule(state);
    },
    debug: true,
  } as any),
  deserialize: false,
  whitelist: [
    'analytics',
    'chains',
    'ordinals',
    'softwareKeys',
    'ledger',
    'networks',
    'onboarding',
    'settings',
    'manageTokens',
  ],
};
