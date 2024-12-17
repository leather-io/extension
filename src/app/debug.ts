import * as reduxPersist from 'redux-persist';

import { HIRO_API_BASE_URL_MAINNET } from '@leather.io/models';
import { getHiroApiRateLimiter } from '@leather.io/query';

import { logger } from '@shared/logger';
import { getLogsFromBrowserStorage } from '@shared/logger-storage';
import { persistConfig } from '@shared/storage/redux-pesist';

import { queryClient } from './common/persistence';
import { store } from './store';
import { stxChainSlice } from './store/chains/stx-chain.slice';
import { settingsSlice } from './store/settings/settings.slice';
import { submittedTransactionsActions } from './store/submitted-transactions/submitted-transactions.actions';

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
  logHiroLimiter(url = HIRO_API_BASE_URL_MAINNET) {
    const limiter = getHiroApiRateLimiter(url);

    return {
      size: limiter.size,
      pending: limiter.pending,
      limiter,
    };
  },
  // Utilised in integration tests
  async logPersistedStore() {
    return reduxPersist.getStoredState(persistConfig);
  },
  setHighestAccountIndex(index: number) {
    logger.info(`Highest account index set to ${index}`);
    store.dispatch(stxChainSlice.actions.restoreAccountIndex(index));
  },
  resetMessages() {
    store.dispatch(settingsSlice.actions.resetMessages());
  },
  clearSubmittedTransactions() {
    store.dispatch(submittedTransactionsActions.clearSubmittedTransactions());
  },
  clearReactQueryCache() {
    queryClient.clear();
  },
  clearChromeStorage() {
    chrome.storage.local.clear();
    chrome.storage.session.clear();
  },
  bypassInscriptionChecks() {
    store.dispatch(settingsSlice.actions.dangerouslyChosenToBypassAllInscriptionChecks());
  },
  resetInscriptionState() {
    store.dispatch(settingsSlice.actions.resetInscriptionState());
  },
};

export function setDebugOnGlobal() {
  window.debug = debug;
}
