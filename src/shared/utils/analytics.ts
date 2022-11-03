import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';

import { IS_PROD_ENV, IS_TEST_ENV, SEGMENT_WRITE_KEY, SENTRY_DSN } from '@shared/environment';
import { logger } from '@shared/logger';

export let analytics: Analytics;

export function initSentry() {
  if (IS_PROD_ENV && !SENTRY_DSN) {
    logger.info('Sentry init aborted: no dsn');
    return;
  }

  /* Sentry.init({ */
  /*   dsn: SENTRY_DSN, */
  /*   integrations: [new Integrations.BrowserTracing()], */
  /*   tracesSampleRate: 0, */
  /*   enabled: checkUserHasGrantedPermission(), */
  /*   beforeSend(event) { */
  /*     if (!checkUserHasGrantedPermission()) return null; */
  /*     return event; */
  /*   }, */
  /* }); */
}

export function initSegment() {
  if (IS_TEST_ENV || !SEGMENT_WRITE_KEY) return;

  return AnalyticsBrowser.standalone(SEGMENT_WRITE_KEY, {
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
    .catch(error => logger.error('Unable to init segment', error));
}
