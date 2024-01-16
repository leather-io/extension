import React from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';
import { base58 } from '@scure/base';
import { AnalyticsBrowser } from '@segment/analytics-next';
import * as Sentry from '@sentry/react';
import { token } from 'leather-styles/tokens';
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

// Used to create a unique identifier for a user's key in base58.
// K = ripemd160(sha256(publicKey))[:8]
export function deriveAnalyticsIdentifier(publicKey: Uint8Array) {
  return base58.encode(ripemd160(sha256(publicKey)).slice(0, 8));
}

export async function identifyUser(publicKey: Uint8Array) {
  return analytics.identify(deriveAnalyticsIdentifier(publicKey));
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
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      new Sentry.Feedback({
        colorScheme: 'system',
        isEmailRequired: false,
        buttonLabel: 'Give feedback',
        formTitle: 'Give feedback',
        autoInject: false,
        showEmail: false,
        showName: false,
        showBranding: false,
        messageLabel: 'Feedback',
        submitButtonLabel: 'Send feedback',
        messagePlaceholder: 'How can we improve Leather?',
        successMessageText: 'Thanks for helping make Leather better',
        themeDark: {
          background: token('colors.accent.background-primary'),
          inputOutlineFocus: token('colors.accent.border-hover'),
          submitBackground: token('colors.accent.component-background-default'),
          submitBackgroundHover: token('colors.accent.component-background-hover'),
          submitOutlineFocus: token('colors.accent.border-hover'),
          submitBorder: token('colors.accent.component-background-default'),
          cancelBackground: token('colors.colorPalette.action-primary-default'),
          cancelBackgroundHover: token('colors.colorPalette.action-primary-hover'),
        },
        themeLight: {
          submitBackground: token('colors.lightModeInk.12'),
          submitBackgroundHover: token('colors.lightModeInk.12'),
          submitOutlineFocus: token('colors.lightModeInk.12'),
        },
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
