import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';

import { IS_PROD_ENV, IS_TEST_ENV, SEGMENT_WRITE_KEY } from '@shared/environment';
import { logger } from '@shared/logger';
import { checkUserHasGrantedPermission } from '@shared/utils/sentry-init';

export let analytics: Analytics;

export function initSegment() {
  const writeKey = SEGMENT_WRITE_KEY;
  const hasPermission = checkUserHasGrantedPermission();
  if (!hasPermission) {
    logger.info('segment init aborted: has no permission.');
    return;
  }
  if (IS_TEST_ENV) return;
  if (!SEGMENT_WRITE_KEY) {
    if (IS_PROD_ENV) logger.error('segment init aborted: No WRITE_KEY setup.');
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
