import toast from 'react-hot-toast';

import * as reduxPersist from 'redux-persist';

import { getLogsFromBrowserStorage } from '@shared/logger-storage';
import { persistConfig } from '@shared/storage/redux-pesist';

import { queryClient } from './common/persistence';
import { store } from './store';
import { stxChainSlice } from './store/chains/stx-chain.slice';
import { settingsSlice } from './store/settings/settings.slice';

declare global {
  interface Window {
    debug: typeof debug;
  }
}

const debug = {
  printDiagnosticInfo() {
    // eslint-disable-next-line no-console
    void getLogsFromBrowserStorage().then(logs => console.log(JSON.stringify(logs)));
  },
  logStore() {
    return store.getState();
  },
  // Utilised in integration tests
  async logPersistedStore() {
    return reduxPersist.getStoredState(persistConfig);
  },
  setHighestAccountIndex(index: number) {
    toast.success('Highest account index set to ' + index);
    store.dispatch(stxChainSlice.actions.restoreAccountIndex(index));
  },
  resetMessages() {
    store.dispatch(settingsSlice.actions.resetMessages());
  },
  clearReactQueryCache() {
    queryClient.clear();
  },
  clearChromeStorage() {
    chrome.storage.local.clear();
  },
};

export function setDebugOnGlobal() {
  window.debug = debug;
}
