import { Route, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useTrackFirstDeposit } from '@app/common/hooks/analytics/transactions-analytics.hooks';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { Header } from '@app/components/header';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { AssetsList } from '@app/features/asset-list/asset-list';
import { InAppMessages } from '@app/features/hiro-messages/in-app-messages';
import { homePageModalRoutes } from '@app/routes/app-routes';
import { ModalBackgroundWrapper } from '@app/routes/components/modal-background-wrapper';
import { useBitcoinExtendedPublicKeyVersions } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';

import { CurrentAccount } from './components/account-area';
import { HomeTabs } from './components/home-tabs';
import { HomeLayout } from './components/home.layout';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();

  const navigate = useNavigate();

  useTrackFirstDeposit();

  const { whenWallet, walletType } = useWalletType();

  console.log(walletType);

  console.log(whenWallet({ ledger: 'ledger', software: 'software' }));

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
        <ModalBackgroundWrapper>
          <Route index element={<AssetsList />} />
          <Route path={RouteUrls.Activity} element={<ActivityList />}>
            {homePageModalRoutes}
          </Route>

          {homePageModalRoutes}
        </ModalBackgroundWrapper>
      </HomeTabs>
    </HomeLayout>
  );
}
