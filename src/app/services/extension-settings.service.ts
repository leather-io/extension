import { SettingsService } from '@leather.io/services';

import { store } from '@app/store';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

export class ExtensionSettingsService implements SettingsService {
  getSettings() {
    return {
      quoteCurrency: 'USD',
      network: selectCurrentNetwork(store.getState()),
    };
  }
}
