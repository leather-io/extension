import { AnalyticsBrowser } from '@segment/analytics-next';
import * as Sentry from '@sentry/react';
import { getStoredState } from 'redux-persist';

import {
  IS_TEST_ENV,
  SEGMENT_WRITE_KEY,
  SENTRY_DSN,
  WALLET_ENVIRONMENT,
} from '@shared/environment';
import { persistConfig } from '@shared/storage/redux-pesist';

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
      new Sentry.BrowserTracing({
        traceFetch: false,
        traceXHR: false,
        startTransactionOnLocationChange: false,
        startTransactionOnPageLoad: false,
        markBackgroundTransactions: false,
      }),
    ],
    ignoreErrors: [
      // Harmless error
      'ResizeObserver loop limit exceeded',
      /ResizeObserver/,
      // Failed network requests needn't be tracked
      'Network request failed',
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

      const values = event.exception?.values?.map(({ value }) => value);

      // @see https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
      if (values?.includes('ResizeObserver loop limit exceeded')) {
        return null;
      }
      return event;
    },
  });
}
