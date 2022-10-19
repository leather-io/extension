import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import { IS_PROD_ENV, IS_TEST_ENV, SEGMENT_WRITE_KEY, SENTRY_DSN } from '@shared/environment';
import { logger } from '@shared/logger';

import { userHasAllowedDiagnosticsKey } from './storage';

function checkUserHasGrantedPermission() {
  return localStorage.getItem(userHasAllowedDiagnosticsKey) === 'true';
}

export let analytics: Analytics;

export function initSentry() {
  if (IS_PROD_ENV && !SENTRY_DSN) {
    logger.info('Sentry init aborted: no dsn');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0,
    enabled: checkUserHasGrantedPermission(),
    beforeSend(event) {
      if (!checkUserHasGrantedPermission()) return null;
      return event;
    },
  });
}

export function initSegment() {
  if (IS_TEST_ENV || !SEGMENT_WRITE_KEY) return;

  const hasPermission = checkUserHasGrantedPermission();

  if (IS_PROD_ENV && !hasPermission) return;

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
    .catch(error => logger.error({ error }));
}
