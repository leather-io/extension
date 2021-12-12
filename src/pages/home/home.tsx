import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { useRouteHeader } from '@common/hooks/use-route-header';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { Header } from '@components/header';
import { HiroMessages } from '@features/hiro-messages/hiro-messages';
import { ActivityList } from '@features/activity-list/account-activity';
import { BalancesList } from '@features/balances-list/balances-list';
import { CurrentAccount } from '@pages/home/components/account-area';
import { HomeActions } from '@pages/home/components/home-actions';
import { RouteUrls } from '@routes/route-urls';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';

import { HomeTabs } from './components/home-tabs';

export const Home = () => {
  const { decodedAuthRequest } = useOnboardingState();
  const { hasGeneratedWallet, encryptedSecretKey } = useWallet();
  const navigate = useNavigate();

  useRouteHeader(
    <>
      <HiroMessages mx="tight" />
      <Header pt="base-tight" />
    </>
  );

  useEffect(() => {
    if (decodedAuthRequest) navigate(RouteUrls.ChooseAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keeps locking in sync b/w view modes
  if (!hasGeneratedWallet && encryptedSecretKey) return <Navigate to={RouteUrls.Unlock} />;

  return (
    <>
      <Stack data-testid="home-page" flexGrow={1} spacing="loose">
        <CurrentAccount />
        <HomeActions />
        <HomeTabs
          balances={<BalancesList data-testid={HomePageSelectors.BalancesList} />}
          activity={<ActivityList />}
        />
      </Stack>
      <Outlet />
    </>
  );
};
