import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { settingsActions } from '@app/store/settings/settings.actions';

import { AllowDiagnosticsLayout } from './allow-diagnostics-layout';

export function AllowDiagnosticsModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const analytics = useAnalytics();
  const { pathname } = useLocation();

  useEffect(() => void analytics.page('view', `${pathname}`), [analytics, pathname]);

  const setDiagnosticsPermissionsAndGoToOnboarding = useCallback(
    (areDiagnosticsAllowed: boolean) => {
      dispatch(settingsActions.setHasAllowedAnalytics(areDiagnosticsAllowed));

      navigate(RouteUrls.Onboarding);
    },
    [navigate, dispatch]
  );

  return (
    <AllowDiagnosticsLayout
      onUserDenyDiagnostics={() => {
        void analytics.track('respond_diagnostics_consent', {
          areDiagnosticsAllowed: false,
        });
        setDiagnosticsPermissionsAndGoToOnboarding(false);
      }}
      onUserAllowDiagnostics={() => {
        void analytics.track('respond_diagnostics_consent', {
          areDiagnosticsAllowed: true,
        });
        setDiagnosticsPermissionsAndGoToOnboarding(true);
      }}
    />
  );
}
