import { initServicesContainer } from '@leather.io/services';

import { WALLET_ENVIRONMENT } from '@shared/environment';
import { logger } from '@shared/logger';

import { ExtensionHttpCacheService } from './extension-http-cache.service';
import { ExtensionSettingsService } from './extension-settings.service';

export function initAppServices() {
  logger.debug('initAppServices');
  initServicesContainer({
    env: {
      environment: WALLET_ENVIRONMENT,
    },
    cacheService: ExtensionHttpCacheService,
    settingsService: ExtensionSettingsService,
  });
}
