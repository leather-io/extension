import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { Header } from '@app/components/header';
import { RouteUrls } from '@shared/route-urls';
import { useHasAllowedDiagnostics } from '@app/store/onboarding/onboarding.hooks';

import { WelcomeLayout } from './welcome.layout';

export const WelcomePage = memo(() => {
  const [hasAllowedDiagnostics] = useHasAllowedDiagnostics();
  const navigate = useNavigate();
  const { hasGeneratedWallet, hasSetPassword, encryptedSecretKey, makeWallet } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();

  useRouteHeader(<Header hideActions />);

  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);

  const startOnboarding = useCallback(async () => {
    setIsGeneratingWallet(true);
    await makeWallet();

    void analytics.track('generate_new_secret_key');

    if (decodedAuthRequest) {
      navigate(RouteUrls.SetPassword);
    }
    navigate(RouteUrls.BackUpSecretKey);
  }, [makeWallet, analytics, decodedAuthRequest, navigate]);

  useEffect(() => {
    if (hasAllowedDiagnostics === undefined) navigate(RouteUrls.RequestDiagnostics);

    return () => setIsGeneratingWallet(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Catch if onboarding has been completed and route to Home
    if ((hasGeneratedWallet || encryptedSecretKey) && hasSetPassword) navigate(RouteUrls.Home);
  }, [encryptedSecretKey, hasGeneratedWallet, hasSetPassword, navigate]);

  return (
    <WelcomeLayout
      isGeneratingWallet={isGeneratingWallet}
      onStartOnboarding={() => startOnboarding()}
      onRestoreWallet={() => navigate(RouteUrls.SignIn)}
    />
  );
});
