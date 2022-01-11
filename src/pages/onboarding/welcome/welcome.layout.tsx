import React from 'react';
import { Button, Stack } from '@stacks/ui';

import { Header } from '@components/header';
import { PopupContainer } from '@components/popup/container';
import { Body, Title } from '@components/typography';
import { Link } from '@components/link';
import { InitialPageSelectors } from '@tests/integration/initial-page.selectors';

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout(props: WelcomeLayoutProps) {
  const { isGeneratingWallet, onStartOnboarding, onRestoreWallet } = props;
  return (
    <PopupContainer header={<Header hideActions />} requestType="auth">
      <Stack spacing="extra-loose" flexGrow={1} justifyContent="center">
        <Stack width="100%" spacing="loose" textAlign="center" alignItems="center">
          <Title as="h1" fontWeight={500}>
            Hiro Wallet is installed
          </Title>
          <Body maxWidth="28ch">Are you new to Stacks or do you already have a Secret Key?</Body>
        </Stack>
        <Stack justifyContent="center" spacing="loose" textAlign="center" {...props}>
          <Button
            onClick={onStartOnboarding}
            isLoading={isGeneratingWallet}
            data-testid={InitialPageSelectors.SignUp}
            borderRadius="10px"
          >
            I'm new to Stacks
          </Button>
          <Link onClick={onRestoreWallet} data-testid={InitialPageSelectors.SignIn}>
            Sign in with Secret Key
          </Link>
        </Stack>
      </Stack>
    </PopupContainer>
  );
}
