import { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { AssetsList } from '@app/features/asset-list/asset-list';
import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { FeedbackButton } from '@app/features/feedback-button/feedback-button';
import { homePageModalRoutes } from '@app/routes/app-routes';
import { ModalBackgroundWrapper } from '@app/routes/components/modal-background-wrapper';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { AccountCard } from '@app/ui/components/account/account.card';
import { HomeLayout } from '@app/ui/pages/home.layout';

import { AccountActions } from './components/account-actions';
import { HomeTabs } from './components/home-tabs';

export function Home() {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const { decodedAuthRequest } = useOnboardingState();

  const navigate = useNavigate();
  const name = useCurrentAccountDisplayName();

  const account = useCurrentStacksAccount();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { totalUsdBalance, isInitialLoading } = useTotalBalance({
    btcAddress,
    stxAddress: account?.address || '',
  });

  useOnMount(() => {
    if (decodedAuthRequest) navigate(RouteUrls.ChooseAccount);
  });

  return (
    <HomeLayout
      accountCard={
        <AccountCard
          name={name}
          balance={totalUsdBalance}
          switchAccount={
            <SwitchAccountDialog
              isShowing={isShowingSwitchAccount}
              onClose={() => setIsShowingSwitchAccount(false)}
            />
          }
          toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
          isLoadingBalance={isInitialLoading}
        >
          <AccountActions />
        </AccountCard>
      }
    >
      <FeedbackButton />
      <button
        onClick={() => {
          chrome.windows.create({ url: chrome.runtime.getURL('index.html'), type: 'popup' });
        }}
      >
        Open test popup
      </button>
      <button
        onClick={() => {
          navigate('./approver');
        }}
      >
        Go to test instance
      </button>
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
