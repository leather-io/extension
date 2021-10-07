import React, { useCallback } from 'react';

import { ScreenPaths } from '@common/types';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useHasAllowedDiagnostics } from '@store/onboarding/onboarding.hooks';

import { initSentry } from '@common/sentry-init';
import { initSegment } from '@common/segment-init';
import { AllowDiagnosticsFullLayout } from './allow-diagnostics-layout';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';

export const AllowDiagnosticsFullPage = () => {
  const changeScreen = useChangeScreen();
  const [, setHasAllowedDiagnostics] = useHasAllowedDiagnostics();

  const goHomeAndSetDiagnosticsPermissionTo = useCallback(
    (areDiagnosticsAllowed: boolean | undefined) => {
      if (typeof areDiagnosticsAllowed === undefined) return;
      setHasAllowedDiagnostics(areDiagnosticsAllowed);
      if (areDiagnosticsAllowed) {
        initSentry();
        void initSegment();
      }
      changeScreen(ScreenPaths.HOME);
    },
    [changeScreen, setHasAllowedDiagnostics]
  );

  return (
    <PopupContainer header={<Header hideActions />} requestType="auth">
      <AllowDiagnosticsFullLayout
        onUserDenyDiagnosticsPermissions={() => goHomeAndSetDiagnosticsPermissionTo(false)}
        onUserAllowDiagnostics={() => goHomeAndSetDiagnosticsPermissionTo(true)}
      />
    </PopupContainer>
  );
};
