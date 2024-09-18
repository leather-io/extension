import { BitflowSDK } from 'bitflow-sdk';

import {
  BITFLOW_API_HOST,
  BITFLOW_API_KEY,
  BITFLOW_READONLY_CALL_API_HOST,
  BITFLOW_STACKS_API_HOST,
} from '@shared/environment';
import { logger } from '@shared/logger';

export const bitflow: BitflowSDK = (() => {
  try {
    return new BitflowSDK({
      API_HOST: BITFLOW_API_HOST,
      API_KEY: BITFLOW_API_KEY,
      STACKS_API_HOST: BITFLOW_STACKS_API_HOST,
      READONLY_CALL_API_HOST: BITFLOW_READONLY_CALL_API_HOST,
    });
  } catch (e) {
    logger.error('Bitflow SDK initialization failed');
    // return fallback dummy object
    return {} as BitflowSDK;
  }
})();
