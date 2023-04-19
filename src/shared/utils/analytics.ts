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

export const analytics = new AnalyticsBrowser();

export function initAnalytics() {
  return analytics.load(
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

export function initSentry() {
  if (IS_TEST_ENV || !SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        traceFetch: false,
        traceXHR: false,
        startTransactionOnLocationChange: false,
        startTransactionOnPageLoad: false,
        markBackgroundTransactions: false,
      }),
    ],
    tracesSampleRate: 1,
    environment: WALLET_ENVIRONMENT,
    autoSessionTracking: false,
    async beforeSend(event) {
      const state = (await getStoredState(persistConfig)) as RootState;
      const hasAllowedAnalytics = state.settings.hasAllowedAnalytics;

      if (!hasAllowedAnalytics) return null;

      delete event.user?.ip_address;
      delete event.extra?.ip_address;

      return event;
    },
  });
}
