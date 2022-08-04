import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import { SENTRY_DSN } from '@shared/environment';

import { userHasAllowedDiagnosticsKey } from './storage';

export function checkUserHasGrantedPermission() {
  return localStorage.getItem(userHasAllowedDiagnosticsKey) === 'true';
}

export function initSentry() {
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
