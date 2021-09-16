import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import { userHasAllowedDiagnosticsKey } from '@store/onboarding/onboarding.hooks';

function checkUserHasGrantedPermission() {
  return localStorage.getItem(userHasAllowedDiagnosticsKey) === 'true';
}

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    enabled: checkUserHasGrantedPermission(),
    beforeSend(event) {
      if (!checkUserHasGrantedPermission()) return null;
      return event;
    },
  });
}
