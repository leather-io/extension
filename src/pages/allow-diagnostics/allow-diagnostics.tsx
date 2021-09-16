import React, { useCallback } from 'react';

import { ScreenPaths } from '@common/types';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useHasAllowedDiagnostics } from '@store/onboarding/onboarding.hooks';

import { AllowDiagnosticsLayout } from './allow-diagnostics-layout';
import { initSentry } from '@common/sentry-init';

export const AllowDiagnosticsDrawer = () => {
  const changeScreen = useChangeScreen();
  const [, setHasAllowedDiagnostics] = useHasAllowedDiagnostics();

  const goHomeAndSetDiagnosticsPermissionTo = useCallback(
    (areDiagnosticsAllowed: boolean) => {
      changeScreen(ScreenPaths.HOME);
      setHasAllowedDiagnostics(areDiagnosticsAllowed);
      if (areDiagnosticsAllowed) initSentry();
    },
    [changeScreen, setHasAllowedDiagnostics]
  );

  return (
    <AllowDiagnosticsLayout
      onUserDenyDiagnosticsPermissions={() => goHomeAndSetDiagnosticsPermissionTo(false)}
      onUserAllowDiagnostics={() => goHomeAndSetDiagnosticsPermissionTo(true)}
    />
  );
};
