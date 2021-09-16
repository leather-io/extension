import { useEffect } from 'react';

import { ScreenPaths } from '@common/types';
import { IS_TEST_ENV } from '@common/constants';
import { userHasAllowedDiagnosticsKey } from '@store/onboarding/onboarding.hooks';

import { useChangeScreen } from './use-change-screen';

export function usePromptUserToSetDiagnosticPermissions() {
  const changeScreen = useChangeScreen();

  useEffect(() => {
    if (IS_TEST_ENV) return;
    const persistedUserDiagnosticDecision = localStorage.getItem(userHasAllowedDiagnosticsKey);
    if (persistedUserDiagnosticDecision === null) changeScreen(ScreenPaths.REQUEST_DIAGNOSTICS);
  }, [changeScreen]);
}
