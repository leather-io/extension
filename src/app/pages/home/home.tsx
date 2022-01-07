import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { isFullPage } from '@app/common/utils';
import { Header } from '@app/components/header';
import { HiroMessages } from '@app/features/hiro-messages/hiro-messages';
import { ActivityList } from '@app/features/activity-list/account-activity';
import { BalancesList } from '@app/features/balances-list/balances-list';
import { CurrentAccount } from '@app/pages/home/components/account-area';
import { HomeActions } from '@app/pages/home/components/home-actions';
import { fullPageContent } from '@app/pages/pages.styles';
import { RouteUrls } from '@shared/route-urls';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';

import { HomeTabs } from './components/home-tabs';

export const Home = () => {
  const { decodedAuthRequest } = useOnboardingState();
  const { hasGeneratedWallet, encryptedSecretKey } = useWallet();
  const navigate = useNavigate();

  useRouteHeader(
    <>
      <HiroMessages mx="tight" />
      <Header />
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
      <Stack
        className={isFullPage ? fullPageContent : undefined}
        data-testid="home-page"
        flexGrow={1}
        mt="loose"
        spacing="loose"
      >
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
