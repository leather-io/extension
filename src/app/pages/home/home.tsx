import { Route, useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useBalances } from '@app/common/hooks/balance/use-balances';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { whenPageMode } from '@app/common/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { FeedbackButton } from '@app/features/feedback-button/feedback-button';
import { SbtcPromoCard } from '@app/features/sbtc-promo-card/sbtc-promo-card';
import { Assets } from '@app/pages/home/components/assets';
import { homePageModalRoutes } from '@app/routes/app-routes';
import { ModalBackgroundWrapper } from '@app/routes/components/modal-background-wrapper';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useTogglePrivateMode } from '@app/store/settings/settings.actions';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';
import { AccountCard } from '@app/ui/components/account/account.card';

import { AccountActions } from './components/account-actions';
import { HomeTabs } from './components/home-tabs';

const leatherEarnUrl = 'https://earn.leather.io';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const navigate = useNavigate();
  const account = useCurrentStacksAccount();
  const currentAccountIndex = useCurrentAccountIndex();
  const isPrivateMode = useIsPrivateMode();
  const togglePrivateMode = useTogglePrivateMode();

  const { data: name = '', isFetching: isFetchingBnsName } = useAccountDisplayName({
    address: account?.address || '',
    index: currentAccountIndex || 0,
  });

  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { totalUsdBalance, availableUsdBalance, isPending, isLoadingAdditionalData } = useBalances({
    btcAddress,
    stxAddress: account?.address || '',
  });

  useOnMount(() => {
    if (decodedAuthRequest) navigate(RouteUrls.ChooseAccount);
  });

  return (
    <Stack
      data-testid={HomePageSelectors.HomePageContainer}
      px={{ base: 0, md: 'space.05' }}
      py={{ base: 0, md: 'space.07' }}
      gap={{ base: 0, md: 'space.06' }}
      width="100%"
      bg="ink.1"
      borderRadius="lg"
      animation="fadein"
      animationDuration="500ms"
    >
      <Box px={{ base: 'space.05', md: 0 }} pb={{ base: 'space.05', md: 0 }}>
        <AccountCard
          name={name}
          availableBalance={availableUsdBalance}
          totalBalance={totalUsdBalance}
          toggleSwitchAccount={() => toggleSwitchAccount()}
          isFetchingBnsName={isFetchingBnsName}
          isLoadingBalance={isPending}
          isLoadingAdditionalData={isLoadingAdditionalData}
          isBalancePrivate={isPrivateMode}
          onShowBalance={togglePrivateMode}
        >
          <AccountActions />
        </AccountCard>
        <SbtcPromoCard mt="space.05" onClick={() => openInNewTab(leatherEarnUrl)} />
      </Box>
      {whenPageMode({ full: <FeedbackButton />, popup: null })}
      <HomeTabs>
        <ModalBackgroundWrapper>
          <Route index element={<Assets />} />
          <Route path={RouteUrls.Activity} element={<ActivityList />}>
            {homePageModalRoutes}
          </Route>
          {homePageModalRoutes}
        </ModalBackgroundWrapper>
      </HomeTabs>
    </Stack>
  );
}
