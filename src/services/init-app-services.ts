import { initializeServiceContainers } from '@leather.io/services';

import { logger } from '@shared/logger';

import { createExtensionHttpCacheService } from './extension-http-cache.service';
import { createExtensionSettingsService } from './extension-settings.service';

export function initAppServices() {
  const startTime = performance.now();
  logger.debug(`[${new Date().toISOString()}] Starting app services initialization...`);

  try {
    initializeServiceContainers(
      createExtensionSettingsService(),
      createExtensionHttpCacheService()
    );

    const duration = Math.round(performance.now() - startTime);
    logger.debug(
      `[${new Date().toISOString()}] App services initialized successfully in ${duration}ms`
    );
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    logger.error(
      `[${new Date().toISOString()}] Failed to initialize app services after ${duration}ms:`,
      error
    );
    throw error;
  }
}
