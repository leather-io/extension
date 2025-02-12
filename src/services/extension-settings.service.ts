import { NetworkSettingsService } from '@leather.io/services';

import { store } from '@app/store';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

export function createExtensionSettingsService(): NetworkSettingsService {
  return {
    getConfig() {
      return selectCurrentNetwork(store.getState());
    },
  };
}
