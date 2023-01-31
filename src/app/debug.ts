import { featureFlags } from '@shared/feature-flags';
import { getLogsFromBrowserStorage } from '@shared/logger-storage';

import { store } from './store';
import { stxChainSlice } from './store/chains/stx-chain.slice';

declare global {
  interface Window {
    debug: typeof debug;
  }
}

const debug = {
  setBitcoinFeature(val: boolean) {
    featureFlags.bitcoinEnabled = val;
  },
  printDiagnosticInfo() {
    // eslint-disable-next-line no-console
    void getLogsFromBrowserStorage().then(logs => console.log(JSON.stringify(logs)));
  },
  logStore() {
    return store.getState();
  },
  setHighestAccountIndex(index: number) {
    store.dispatch(stxChainSlice.actions.restoreAccountIndex(index));
  },
};

export function setDebugOnGlobal() {
  window.debug = debug;
}
