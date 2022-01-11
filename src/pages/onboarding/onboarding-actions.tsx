import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, StackProps } from '@stacks/ui';

import { useWallet } from '@common/hooks/use-wallet';
import { RouteUrls } from '@routes/route-urls';
import { Link } from '@components/link';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { InitialPageSelectors } from '@tests/integration/initial-page.selectors';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

export function OnboardingActions(props: StackProps) {
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const { makeWallet } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  useEffect(() => {
    return () => setIsGeneratingWallet(false);
  }, []);

  const startOnboarding = useCallback(async () => {
    setIsGeneratingWallet(true);
    await makeWallet();

    void analytics.track('generate_new_secret_key');

    if (decodedAuthRequest) {
      navigate(RouteUrls.SetPassword);
    }
    navigate(RouteUrls.SaveSecretKey);
  }, [makeWallet, analytics, decodedAuthRequest, navigate]);

  return (
    <Stack justifyContent="center" spacing="loose" textAlign="center" {...props}>
      <Button
        onClick={startOnboarding}
        isLoading={isGeneratingWallet}
        data-testid={InitialPageSelectors.SignUp}
        borderRadius="10px"
      >
        I'm new to Stacks
      </Button>
      <Link onClick={() => navigate(RouteUrls.SignIn)} data-testid={InitialPageSelectors.SignIn}>
        Sign in with Secret Key
      </Link>
    </Stack>
  );
}
