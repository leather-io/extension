import { Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Flex, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { HOME_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { HiroMessages } from '@app/features/hiro-messages/hiro-messages';
import { ActivityList } from '@app/features/activity-list/account-activity';
import { BalancesList } from '@app/features/balances-list/balances-list';

import { HomeActions } from '@app/pages/home/components/home-actions';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { RouteUrls } from '@shared/route-urls';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';
import { AccountInfoFetcher, BalanceFetcher } from './components/fetchers';
import { HomeTabs } from './components/home-tabs';
import { OnboardingStepsList } from './components/onboarding-steps-list';
import { useOnboardingSteps } from './hooks/use-onboarding-steps';
import { useTrackFirstDeposit } from '@app/common/hooks/analytics/transactions-analytics.hooks';

import { CurrentAccount } from './components/account-area';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();
  const { showOnboardingSteps } = useOnboardingSteps();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  useTrackFirstDeposit();

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

  if (!account) return <FullPageLoadingSpinner />;

  return (
    <>
      <Suspense fallback={null}>
        {account?.address && <BalanceFetcher address={account.address} />}
        {account?.address && <AccountInfoFetcher address={account.address} />}
      </Suspense>
      <Stack alignItems="center" width="100%" spacing="extra-tight">
        {showOnboardingSteps && <OnboardingStepsList />}
        <Stack
          data-testid="home-page"
          maxWidth={['unset', HOME_FULL_PAGE_MAX_WIDTH]}
          mt="extra-loose"
          px={['base-loose', 'base-loose', 'base-loose', 'unset']}
          spacing="loose"
          width="100%"
        >
          <Flex
            flexDirection={['column', 'column', 'unset']}
            alignItems={['start', 'start', 'center']}
            justifyContent={['unset', 'space-between']}
          >
            <CurrentAccount />
            <HomeActions />
          </Flex>
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
      </Stack>
      <Outlet />
    </>
  );
}
