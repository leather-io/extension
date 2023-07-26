import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { doesBrowserSupportWebUsbApi, whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { Header } from '@app/components/header';
import { useHasUserRespondedToAnalyticsConsent } from '@app/store/settings/settings.selectors';

import { WelcomeLayout } from './welcome.layout';

export const WelcomePage = memo(() => {
  const hasResponded = useHasUserRespondedToAnalyticsConsent();
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
    if (!hasResponded) navigate(RouteUrls.RequestDiagnostics);
    return () => setIsGeneratingWallet(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageModeRoutingAction = (url: string) =>
    whenPageMode({
      full() {
        navigate(url);
      },
      popup() {
        void openIndexPageInNewTab(`${RouteUrls.Onboarding}/${url}`);
      },
    });

  const supportsWebUsbAction = pageModeRoutingAction('stacks/' + RouteUrls.ConnectLedger);
  const doesNotSupportWebUsbAction = pageModeRoutingAction(RouteUrls.LedgerUnsupportedBrowser);

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
