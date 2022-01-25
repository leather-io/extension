import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { userHasAllowedDiagnosticsKey } from './storage';

export function checkUserHasGrantedPermission() {
  return localStorage.getItem(userHasAllowedDiagnosticsKey) === 'true';
}

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.1,
    enabled: checkUserHasGrantedPermission(),
    beforeSend(event) {
      if (!checkUserHasGrantedPermission()) return null;
      return event;
    },
  });
}
