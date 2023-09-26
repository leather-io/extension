import { useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useTrackFirstDeposit } from '@app/common/hooks/analytics/transactions-analytics.hooks';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ExternalContentFrame } from '@app/components/external-content-frame';
import { Header } from '@app/components/header';
import { InAppMessages } from '@app/features/hiro-messages/in-app-messages';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { CurrentAccount } from './components/account-area';
import { HomeTabs } from './components/home-tabs';
import { HomeLayout } from './components/home.layout';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();

  const stacksAccount = useCurrentStacksAccount();
  const navigate = useNavigate();
  useTrackFirstDeposit();
  const ref = useRef<HTMLIFrameElement>(null);

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
      <ExternalContentFrame src="https://ordinal.vercel.app/preview/7d9546000f48bcd65be58a45a57c80f75a4851523aebc738d5dac6738ceae2aai0" />
      <HomeTabs>
        <Outlet context={{ address: stacksAccount?.address }} />
      </HomeTabs>
    </HomeLayout>
  );
}
