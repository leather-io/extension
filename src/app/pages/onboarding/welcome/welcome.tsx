import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { Header } from '@app/components/header';
import { RouteUrls } from '@shared/route-urls';
import { WelcomeLayout } from './welcome.layout';
import { useHasAllowedDiagnostics } from '@app/store/onboarding/onboarding.hooks';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { whenPageMode } from '@app/common/utils';
import { openNewTabWalletPage } from '@shared/utils/open-wallet-page';

export const WelcomePage = memo(() => {
  const [hasAllowedDiagnostics] = useHasAllowedDiagnostics();
  const navigate = useNavigate();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();
  const keyActions = useKeyActions();

  useRouteHeader(<Header hideActions />);

  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);

  const generateNewWallet = useCallback(async () => {
    setIsGeneratingWallet(true);
    keyActions.generateWalletKey();
    void analytics.track('generate_new_secret_key');
    if (decodedAuthRequest) {
      navigate(RouteUrls.SetPassword);
    }
    navigate(RouteUrls.BackUpSecretKey);
  }, [keyActions, analytics, decodedAuthRequest, navigate]);

  const triggerOnboardingAction = useMemo(
    () =>
      whenPageMode({
        popup: () => {
          void analytics.track('user_initiated_onboarding_from_popup_mode');
          void openNewTabWalletPage();
        },
        full: () => void generateNewWallet(),
      }),
    [analytics, generateNewWallet]
  );

  useEffect(() => {
    if (hasAllowedDiagnostics === undefined) navigate(RouteUrls.RequestDiagnostics);

    return () => setIsGeneratingWallet(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WelcomeLayout
      isGeneratingWallet={isGeneratingWallet}
      onStartOnboarding={triggerOnboardingAction}
      onRestoreWallet={() => navigate(RouteUrls.SignIn)}
    />
  );
});
