import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { Header } from '@app/components/header';
import { RouteUrls } from '@shared/route-urls';
import { WelcomeLayout } from './welcome.layout';
import { useHasAllowedDiagnostics } from '@app/store/onboarding/onboarding.hooks';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { doesBrowserSupportWebUsbApi, whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';

export const WelcomePage = memo(() => {
  const [hasAllowedDiagnostics] = useHasAllowedDiagnostics();
  const navigate = useNavigate();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();
  const keyActions = useKeyActions();

  useRouteHeader(<Header hideActions />);

  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);

  const startOnboarding = useCallback(async () => {
    setIsGeneratingWallet(true);
    keyActions.generateWalletKey();
    void analytics.track('generate_new_secret_key');
    if (decodedAuthRequest) {
      navigate(RouteUrls.SetPassword);
    }
    navigate(RouteUrls.BackUpSecretKey);
  }, [keyActions, analytics, decodedAuthRequest, navigate]);

  useEffect(() => {
    if (hasAllowedDiagnostics === undefined) navigate(RouteUrls.RequestDiagnostics);

    return () => setIsGeneratingWallet(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supportsWebUsbAction = whenPageMode({
    full() {
      navigate(RouteUrls.ConnectLedger);
    },
    popup() {
      void openIndexPageInNewTab(`${RouteUrls.Onboarding}/${RouteUrls.ConnectLedger}`);
    },
  });

  const doesNotSupportWebUsbAction = whenPageMode({
    full: navigate as any,
    popup: openIndexPageInNewTab,
  });

  return (
    <WelcomeLayout
      isGeneratingWallet={isGeneratingWallet}
      onSelectConnectLedger={() =>
        doesBrowserSupportWebUsbApi() ? supportsWebUsbAction() : doesNotSupportWebUsbAction()
      }
      onStartOnboarding={() => startOnboarding()}
      onRestoreWallet={() => navigate(RouteUrls.SignIn)}
    />
  );
});
