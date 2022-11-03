import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';

import { IS_TEST_ENV, SEGMENT_WRITE_KEY } from '@shared/environment';
import { logger } from '@shared/logger';

const analyticsClient = new Promise<null | Analytics>(resolve => {
  if (IS_TEST_ENV || !SEGMENT_WRITE_KEY) resolve(null);

  void AnalyticsBrowser.standalone(SEGMENT_WRITE_KEY, {
    integrations: {
      'Segment.io': {
        deliveryStrategy: {
          strategy: 'batching',
          config: {
            size: 10,
            timeout: 5000,
          },
        },
      },
    },
  })
    .then(client => resolve(client))
    .catch(error => {
      logger.error('Unable to init segment', error);
      resolve(null);
    });
});

export function getAnalyticsClient() {
  return analyticsClient;
}

export function initSentry() {
  // TODO
  // https://github.com/hirosystems/stacks-wallet-web/issues/2822
}
