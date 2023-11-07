import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useTrackFirstDeposit } from '@app/common/hooks/analytics/transactions-analytics.hooks';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { InAppMessages } from '@app/features/hiro-messages/in-app-messages';

import { CurrentAccount } from './components/account-area';
import { HomeTabs } from './components/home-tabs';
import { HomeLayout } from './components/home.layout';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();

  const navigate = useNavigate();

  useTrackFirstDeposit();

  useRouteHeader(
    <>
      <InAppMessages />
      <Header />
    </>
  );

  useOnMount(() => {
    if (decodedAuthRequest) navigate(RouteUrls.ChooseAccount);
  });

  return (
    <HomeLayout currentAccount={<CurrentAccount />}>
      <HomeTabs>
        <Outlet />
        {/* <ModalBackgroundWrapper> */}

        {/* </ModalBackgroundWrapper> */}
      </HomeTabs>
    </HomeLayout>
  );
}
