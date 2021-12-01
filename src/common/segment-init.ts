import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';
import { IS_TEST_ENV } from './constants';
import { logger } from './logger';
import { checkUserHasGrantedPermission } from './sentry-init';

export let analytics: Analytics;

export function initSegment() {
  const writeKey = process.env.SEGMENT_WRITE_KEY;
  const hasPermission = checkUserHasGrantedPermission();
  if (!hasPermission) {
    logger.info('segment init aborted: has no permission.');
    return;
  }
  if (IS_TEST_ENV) return;
  if (!writeKey) {
    if (process.env.WALLET_ENVIRONMENT === 'production')
      logger.error('segment init aborted: No WRITE_KEY setup.');
    return;
  }

  return AnalyticsBrowser.standalone(writeKey, {
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
    .then(res => (analytics = res))
    .catch(logger.error);
}
