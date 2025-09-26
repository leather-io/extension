import { SettingsService } from '@leather.io/services';
import { serializeAssetId } from '@leather.io/utils';

import { store } from '@app/store';
import { selectTokenState } from '@app/store/manage-tokens/manage-tokens.slice';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

export class ExtensionSettingsService implements SettingsService {
  getSettings() {
    return {
      quoteCurrency: 'USD',
      network: selectCurrentNetwork(store.getState()),
      assetVisibility: Object.fromEntries(
        Object.values(selectTokenState(store.getState()).entities).map(tokenSetting => [
          serializeAssetId({
            protocol: tokenSetting.id.includes('::') ? 'sip10' : 'rune',
            id: tokenSetting.id,
          }),
          tokenSetting.enabled,
        ])
      ),
    };
  }
}
