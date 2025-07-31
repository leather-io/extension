import { Route, useNavigate } from 'react-router';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { formatCurrency } from '@app/common/currency-formatter';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { whenPageMode } from '@app/common/utils';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { FeedbackButton } from '@app/features/feedback-button/feedback-button';
import { PromoBanner } from '@app/features/promo-banner/promo-banner';
import { Assets } from '@app/pages/home/components/assets';
import { useCurrentAccountBalance } from '@app/query/common/account-balance/account-balance.hooks';
import { homePageModalRoutes } from '@app/routes/app-routes';
import { ModalBackgroundWrapper } from '@app/routes/components/modal-background-wrapper';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import {
  refreshLeatherTabs,
  useOnFinishedOnboarding,
} from '@app/store/onboarding/onboarding.hooks';
import { useTogglePrivateMode } from '@app/store/settings/settings.actions';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';
import { AccountCard } from '@app/ui/components/account/account.card';

import { AccountActions } from './components/account-actions';
import { HomeTabs } from './components/home-tabs';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const navigate = useNavigate();
  const account = useCurrentStacksAccount();
  const currentAccountIndex = useCurrentAccountIndex();
  const isPrivateMode = useIsPrivateMode();
  const togglePrivateMode = useTogglePrivateMode();

  useOnFinishedOnboarding(() => refreshLeatherTabs());

  const { data: name = '', isFetching: isFetchingBnsName } = useAccountDisplayName({
    address: account?.address || '',
    index: currentAccountIndex || 0,
  });

  const { availableBalance, totalBalance, isLoading, isLoadingAdditionalData } =
    useCurrentAccountBalance();

  useOnMount(() => {
    if (decodedAuthRequest) return navigate(RouteUrls.ChooseAccount);
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
          availableBalance={formatCurrency(availableBalance)}
          totalBalance={formatCurrency(totalBalance)}
          toggleSwitchAccount={() => toggleSwitchAccount()}
          isFetchingBnsName={isFetchingBnsName}
          isLoadingBalance={isLoading}
          isLoadingAdditionalData={isLoadingAdditionalData}
          isBalancePrivate={isPrivateMode}
          onShowBalance={togglePrivateMode}
        >
          <AccountActions />
        </AccountCard>
        <PromoBanner />
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
