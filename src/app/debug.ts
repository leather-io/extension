import toast from 'react-hot-toast';

import { getLogsFromBrowserStorage } from '@shared/logger-storage';

import { store } from './store';
import { stxChainSlice } from './store/chains/stx-chain.slice';
import { featureFlagSlice } from './store/feature-flags/feature-flags.slice';

declare global {
  interface Window {
    debug: typeof debug;
  }
}

const debug = {
  setBitcoinFeature(val: boolean) {
    const flag = val ? 'enabled' : 'disabled';
    toast[val ? 'success' : 'error']('Bitcoin feature ' + flag);
    store.dispatch(
      featureFlagSlice.actions.enableFeature({
        feature: 'bitcoin',
        mode: val ? 'enabled' : 'disabled',
      })
    );
  },
  printDiagnosticInfo() {
    // eslint-disable-next-line no-console
    void getLogsFromBrowserStorage().then(logs => console.log(JSON.stringify(logs)));
  },
  logStore() {
    return store.getState();
  },
  setHighestAccountIndex(index: number) {
    toast.success('Highest account index set to ' + index);
    store.dispatch(stxChainSlice.actions.restoreAccountIndex(index));
  },
};

export function setDebugOnGlobal() {
  window.debug = debug;
}
