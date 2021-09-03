import React from 'react';
import { Stack } from '@stacks/ui';
import { AppContainer } from '@components/app-container';
import { Header } from '@components/header';
import { BalancesAndActivity } from '@pages/home/components/balances-and-activity';
import { UserAccount } from '@pages/home/components/user-area';
import { HomeActions } from '@pages/home/components/actions';

const PageTop = () => (
  <>
    <UserAccount />
    <HomeActions />
  </>
);

export const PopupHome = () => (
  <AppContainer header={<Header />} requestType="auth">
    <Stack data-testid="home-page" flexGrow={1} spacing="loose">
      <PageTop />
      <BalancesAndActivity />
    </Stack>
  </AppContainer>
);
