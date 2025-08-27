import { initServicesContainer } from '@leather.io/services';

import { WALLET_ENVIRONMENT } from '@shared/environment';

import { ExtensionHttpCacheService } from './extension-http-cache.service';
import { ExtensionSettingsService } from './extension-settings.service';

export function initAppServices() {
  initServicesContainer({
    env: {
      environment: WALLET_ENVIRONMENT,
    },
    cacheService: ExtensionHttpCacheService,
    settingsService: ExtensionSettingsService,
  });
}
