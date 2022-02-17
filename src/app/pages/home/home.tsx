import { Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { Header } from '@app/components/header';
import { HiroMessages } from '@app/features/hiro-messages/hiro-messages';
import { ActivityList } from '@app/features/activity-list/account-activity';
import { BalancesList } from '@app/features/balances-list/balances-list';

import { HomeActions } from '@app/pages/home/components/home-actions';
import { RouteUrls } from '@shared/route-urls';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';
import { useAccounts, useCurrentAccount } from '@app/store/accounts/account.hooks';
import { AccountInfoFetcher, BalanceFetcher } from './components/fetchers';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { HomeTabs } from './components/home-tabs';
import { CurrentAccount } from './components/account-area';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();
  const navigate = useNavigate();

  const account = useCurrentAccount();
  const a = useAccounts();

  console.log(a);

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

  return (
    <>
      <Suspense fallback={null}>
        {account?.address && <BalanceFetcher address={account.address} />}
        {account?.address && <AccountInfoFetcher address={account.address} />}
      </Suspense>
      <Stack
        data-testid="home-page"
        flexGrow={1}
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        mt="loose"
        px={['unset', 'base-loose']}
        spacing="loose"
      >
        <CurrentAccount />
        <HomeActions />
        {account && (
          <HomeTabs
            balances={
              <BalancesList
                address={account?.address}
                data-testid={HomePageSelectors.BalancesList}
              />
            }
            activity={<ActivityList />}
          />
        )}
      </Stack>
      <Outlet />
    </>
  );
}
