import React, { useCallback } from 'react';

import { RouteUrls } from '@routes/route-urls';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useHasAllowedDiagnostics } from '@store/onboarding/onboarding.hooks';

import { initSentry } from '@common/sentry-init';
import { initSegment } from '@common/segment-init';
import { AllowDiagnosticsLayout } from './allow-diagnostics-layout';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';

export const AllowDiagnosticsPage = () => {
  const changeScreen = useChangeScreen();
  const [, setHasAllowedDiagnostics] = useHasAllowedDiagnostics();

  const goToOnboardingAndSetDiagnosticsPermissionTo = useCallback(
    (areDiagnosticsAllowed: boolean | undefined) => {
      if (typeof areDiagnosticsAllowed === undefined) return;
      setHasAllowedDiagnostics(areDiagnosticsAllowed);
      if (areDiagnosticsAllowed) {
        initSentry();
        void initSegment();
      }
      changeScreen(RouteUrls.Onboarding);
    },
    [changeScreen, setHasAllowedDiagnostics]
  );

  return (
    <PopupContainer header={<Header hideActions />} requestType="auth">
      <AllowDiagnosticsLayout
        onUserDenyDiagnosticsPermissions={() => goToOnboardingAndSetDiagnosticsPermissionTo(false)}
        onUserAllowDiagnostics={() => goToOnboardingAndSetDiagnosticsPermissionTo(true)}
      />
    </PopupContainer>
  );
};
