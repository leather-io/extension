import { AnalyticsBrowser } from '@segment/analytics-next';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { getStoredState } from 'redux-persist';

import {
  IS_TEST_ENV,
  SEGMENT_WRITE_KEY,
  SENTRY_DSN,
  WALLET_ENVIRONMENT,
} from '@shared/environment';
import { persistConfig } from '@shared/storage';

import type { RootState } from '@app/store';

function initAnalytics() {
  if (IS_TEST_ENV || !SEGMENT_WRITE_KEY) return null;

  return AnalyticsBrowser.load(
    { writeKey: SEGMENT_WRITE_KEY },
    {
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
    }
  );
}
export const analytics: null | AnalyticsBrowser = initAnalytics();

export function initSentry() {
  if (IS_TEST_ENV || !SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: WALLET_ENVIRONMENT,
    async beforeSend(event) {
      const state = (await getStoredState(persistConfig)) as RootState;
      const hasAllowedAnalytics = state.settings.hasAllowedAnalytics;

      if (!hasAllowedAnalytics) return null;

      delete event.user?.ip_address;
      return event;
    },
  });
}
