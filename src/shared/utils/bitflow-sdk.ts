import { BitflowSDK } from '@bitflowlabs/core-sdk';

import {
  BITFLOW_API_HOST,
  BITFLOW_API_KEY,
  BITFLOW_KEEPER_API_HOST,
  BITFLOW_KEEPER_API_KEY,
  BITFLOW_READONLY_CALL_API_HOST,
  BITFLOW_READONLY_CALL_API_KEY,
} from '@shared/environment';
import { logger } from '@shared/logger';

export const bitflow: BitflowSDK = (() => {
  try {
    return new BitflowSDK({
      BITFLOW_API_HOST: BITFLOW_API_HOST,
      BITFLOW_API_KEY: BITFLOW_API_KEY,
      READONLY_CALL_API_HOST: BITFLOW_READONLY_CALL_API_HOST,
      READONLY_CALL_API_KEY: BITFLOW_READONLY_CALL_API_KEY,
      KEEPER_API_KEY: BITFLOW_KEEPER_API_KEY,
      KEEPER_API_HOST: BITFLOW_KEEPER_API_HOST,
    });
  } catch (e) {
    logger.error('Bitflow SDK initialization failed');
    // return fallback dummy object
    return {} as BitflowSDK;
  }
})();
