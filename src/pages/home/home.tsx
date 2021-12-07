import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { HiroMessages } from '@features/hiro-messages/hiro-messages';
import { ActivityList } from '@features/activity-list/account-activity';
import { BalancesList } from '@features/balances-list/balances-list';
import { CurrentAccount } from '@pages/home/components/account-area';
import { HomeActions } from '@pages/home/components/home-actions';
import { RouteUrls } from '@routes/route-urls';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';

import { HomeTabs } from './components/home-tabs';
import { useWallet } from '@common/hooks/use-wallet';

export const Home = () => {
  const { hasGeneratedWallet, encryptedSecretKey } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasGeneratedWallet || !encryptedSecretKey) navigate(RouteUrls.Onboarding);
    if (decodedAuthRequest) navigate(RouteUrls.ChooseAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PopupContainer
        requestType="auth"
        header={
          <>
            <HiroMessages mx="tight" />
            <Header pt="base-tight" />
          </>
        }
      >
        <Stack data-testid="home-page" flexGrow={1} spacing="loose">
          <CurrentAccount />
          <HomeActions />
          <HomeTabs
            balances={<BalancesList data-testid={HomePageSelectors.BalancesList} />}
            activity={<ActivityList />}
          />
        </Stack>
      </PopupContainer>
      <Outlet />
    </>
  );
};
