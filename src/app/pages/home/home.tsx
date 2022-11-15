import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Flex, Stack } from '@stacks/ui';
import { HomePageSelectors } from '@tests/page-objects/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useTrackFirstDeposit } from '@app/common/hooks/analytics/transactions-analytics.hooks';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { HOME_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { BalancesList } from '@app/features/balances-list/balances-list';
import { HiroMessages } from '@app/features/hiro-messages/hiro-messages';
import { SuggestedFirstSteps } from '@app/features/suggested-first-steps/suggested-first-steps';
import { HomeActions } from '@app/pages/home/components/home-actions';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { CurrentAccount } from './components/account-area';
import { HomeTabs } from './components/home-tabs';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();
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
      <Stack alignItems="center" width="100%" spacing="extra-tight">
        <SuggestedFirstSteps />
        <Stack
          data-testid={HomePageSelectors.HomePageContainer}
          maxWidth={['unset', HOME_FULL_PAGE_MAX_WIDTH]}
          mt="extra-loose"
          px={['base-loose', 'base-loose', 'base-loose', 'unset']}
          spacing="loose"
          width="100%"
        >
          {account ? (
            <>
              <Flex
                flexDirection={['column', 'column', 'unset']}
                alignItems={['start', 'start', 'center']}
                justifyContent={['unset', 'space-between']}
              >
                <CurrentAccount />
                <HomeActions />
              </Flex>
              <HomeTabs
                balances={
                  <BalancesList
                    address={account?.address}
                    data-testid={HomePageSelectors.BalancesList}
                  />
                }
                activity={<ActivityList />}
              />
            </>
          ) : null}
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
}
