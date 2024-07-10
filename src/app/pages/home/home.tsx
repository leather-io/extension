import { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { FeedbackButton } from '@app/features/feedback-button/feedback-button';
import { Assets } from '@app/pages/home/components/assets';
import { homePageModalRoutes } from '@app/routes/app-routes';
import { ModalBackgroundWrapper } from '@app/routes/components/modal-background-wrapper';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { AccountCard } from '@app/ui/components/account/account.card';
import { HomeLayout } from '@app/ui/pages/home.layout';

import { AccountActions } from './components/account-actions';
import { HomeTabs } from './components/home-tabs';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const account = useCurrentStacksAccount();
  const currentAccountIndex = useCurrentAccountIndex();

  const { data: name = '', isFetching: isFetchingBnsName } = useAccountDisplayName({
    address: account?.address || '',
    index: currentAccountIndex || 0,
  });

  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { totalUsdBalance, isLoading } = useTotalBalance({
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
          toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
          isFetchingBnsName={isFetchingBnsName}
          isLoadingBalance={isLoading}
        >
          <AccountActions />
        </AccountCard>
      }
    >
      {isShowingSwitchAccount && (
        <SwitchAccountDialog
          isShowing={isShowingSwitchAccount}
          onClose={() => setIsShowingSwitchAccount(false)}
        />
      )}
      <FeedbackButton />
      <HomeTabs>
        <ModalBackgroundWrapper>
          <Route index element={<Assets />} />
          <Route path={RouteUrls.Activity} element={<ActivityList />}>
            {homePageModalRoutes}
          </Route>
          {homePageModalRoutes}
        </ModalBackgroundWrapper>
      </HomeTabs>
    </HomeLayout>
  );
}
