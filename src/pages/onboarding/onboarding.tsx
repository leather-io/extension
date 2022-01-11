import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { PopupContainer } from '@components/popup/container';
import { Title, Body } from '@components/typography';
import { Header } from '@components/header';
import { RouteUrls } from '@routes/route-urls';
import { useHasAllowedDiagnostics } from '@store/onboarding/onboarding.hooks';

import { OnboardingActions } from './onboarding-actions';

export const Onboarding = memo(() => {
  const [hasAllowedDiagnostics, _] = useHasAllowedDiagnostics();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasAllowedDiagnostics === undefined) navigate(RouteUrls.RequestDiagnostics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PopupContainer header={<Header hideActions />} requestType="auth">
      <Stack spacing="extra-loose" flexGrow={1} justifyContent="center">
        <Stack width="100%" spacing="loose" textAlign="center" alignItems="center">
          <Title as="h1" fontWeight={500}>
            Hiro Wallet is installed
          </Title>
          <Body maxWidth="28ch">Are you new to Stacks or do you already have a Secret Key?</Body>
        </Stack>
        <OnboardingActions />
      </Stack>
    </PopupContainer>
  );
});
