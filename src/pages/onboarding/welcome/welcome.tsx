import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@routes/route-urls';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useHasAllowedDiagnostics } from '@store/onboarding/onboarding.hooks';

import { WelcomeLayout } from './welcome.layout';

export const WelcomePage = memo(() => {
  const [hasAllowedDiagnostics] = useHasAllowedDiagnostics();
  const navigate = useNavigate();
  const { hasGeneratedWallet, hasSetPassword, encryptedSecretKey, makeWallet } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();

  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);

  const startOnboarding = useCallback(async () => {
    setIsGeneratingWallet(true);
    await makeWallet();

    void analytics.track('generate_new_secret_key');

    if (decodedAuthRequest) {
      navigate(RouteUrls.SetPassword);
    }
    navigate(RouteUrls.SaveSecretKey);
  }, [makeWallet, analytics, decodedAuthRequest, navigate]);

  useEffect(() => {
    if (hasAllowedDiagnostics === undefined) navigate(RouteUrls.RequestDiagnostics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => setIsGeneratingWallet(false);
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
