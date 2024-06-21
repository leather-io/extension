import { delay } from '@leather.io/utils';

import { logger } from './logger';

export const defaultWalletKeyId = 'default';

export function closeWindow() {
  if (process.env.DEBUG_PREVENT_WINDOW_CLOSE === 'true') {
    logger.warn('Prevented window close with flag DEBUG_PREVENT_WINDOW_CLOSE');
    return;
  }
  // We prevent `window.close()` directly as to allow for debugging helper
  // eslint-disable-next-line no-restricted-properties
  window.close();
}

export function createDelay(ms: number) {
  return async () => delay(ms);
}
