import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useTrackFirstDeposit } from '@app/common/hooks/analytics/transactions-analytics.hooks';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { BalancesList } from '@app/features/balances-list/balances-list';
import { HiroMessages } from '@app/features/hiro-messages/hiro-messages';
import { SuggestedFirstSteps } from '@app/features/suggested-first-steps/suggested-first-steps';
import { HomeActions } from '@app/pages/home/components/home-actions';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { CurrentAccount } from './components/account-area';
import { HomeTabs } from './components/home-tabs';
import { HomeLayout } from './components/home.layout';
import { HomeLoader } from './home.loader';

export function Home() {
  return <HomeLoader>{account => <HomeContainer account={account} />}</HomeLoader>;
}

interface HomeContainerProps {
  account: StacksAccount;
}
function HomeContainer({ account }: HomeContainerProps) {
  const { decodedAuthRequest } = useOnboardingState();
  const navigate = useNavigate();
  useTrackFirstDeposit();

  useRouteHeader(
    <>
      <HiroMessages mx="tight" />
      <Header />
    </>
  );

  useOnMount(() => {
    if (decodedAuthRequest) navigate(RouteUrls.ChooseAccount);
  });

  return (
    <HomeLayout
      suggestedFirstSteps={<SuggestedFirstSteps />}
      currentAccount={<CurrentAccount />}
      actions={<HomeActions />}
    >
      <HomeTabs balances={<BalancesList address={account.address} />} activity={<ActivityList />} />
      <Outlet />
    </HomeLayout>
  );
}
