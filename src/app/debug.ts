import { featureFlags } from '@shared/feature-flags';
import { getLogsFromBrowserStorage } from '@shared/logger-storage';

import { store } from './store';

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
};

export function setDebugOnGlobal() {
  window.debug = debug;
}
