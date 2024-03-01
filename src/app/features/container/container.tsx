import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { useAnalytics, useInitalizeAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { InAppMessages } from '@app/features/hiro-messages/in-app-messages';
import { useOnSignOut } from '@app/routes/hooks/use-on-sign-out';
import { useOnWalletLock } from '@app/routes/hooks/use-on-wallet-lock';
import { useHasStateRehydrated } from '@app/store';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { ContainerLayout } from '@app/ui/components/containers/container.layout';
import { NetworkModeBadge } from '@app/ui/components/containers/headers/components/network-mode-badge';
import { Header } from '@app/ui/components/containers/headers/header';
import { Flag } from '@app/ui/components/flag/flag';
import { Logo } from '@app/ui/components/logo';
import { HamburgerIcon } from '@app/ui/icons/';

import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { Settings } from '../settings/settings';
import { TotalBalance } from './total-balance';
import {
  getDisplayAddresssBalanceOf,
  isKnownPopupRoute,
  showAccountInfo,
} from './utils/get-popup-header';
import { getTitleFromUrl } from './utils/get-title-from-url';
import {
  canGoBack,
  getIsSessionLocked,
  getPageVariant,
  hideLogo,
  isGetAddressesPopup,
  isLandingPage,
} from './utils/route-helpers';

export function Container() {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const analytics = useAnalytics();
  const hasStateRehydrated = useHasStateRehydrated();
  const { chain, name: chainName } = useCurrentNetworkState();

  useOnWalletLock(() => closeWindow());
  useOnSignOut(() => closeWindow());
  useRestoreFormState();
  useInitalizeAnalytics();

  useEffect(() => void analytics.page('view', `${pathname}`), [analytics, pathname]);

  const variant = getPageVariant(pathname);

  useEffect(() => {
    // set the whole body colour based on page variant so it can update dynamically
    // TODO replace this with data-attributes to improve and fix modal BG colours
    if (variant === 'home') {
      document.body.style.backgroundColor = token('colors.ink.background-primary');
    }
    if (variant === 'page' || variant === 'onboarding') {
      document.body.style.backgroundColor = token('colors.ink.background-secondary');
    }
  }, [variant, pathname]);

  const displayHeader = !isLandingPage(pathname) && !isGetAddressesPopup(pathname);
  const isSessionLocked = getIsSessionLocked(pathname);

  function getOnGoBackLocation(pathname: RouteUrls) {
    if (pathname === RouteUrls.Swap || pathname === RouteUrls.Fund) {
      return navigate(RouteUrls.Home);
    }
    return navigate(-1);
  }

  if (!hasStateRehydrated) return <LoadingSpinner />;

  return (
    <>
      <SwitchAccountDialog
        isShowing={isShowingSwitchAccount}
        onClose={() => setIsShowingSwitchAccount(false)}
      />

      <InAppMessages />
      <ContainerLayout
        header={
          displayHeader ? (
            <Header
              variant={variant}
              onGoBack={canGoBack(pathname) ? () => getOnGoBackLocation(pathname) : undefined}
              settingsMenu={
                isKnownPopupRoute(pathname) ? null : (
                  <Settings
                    triggerButton={
                      <HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />
                    }
                    toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                  />
                )
              }
              networkBadge={
                <NetworkModeBadge
                  isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                  name={chainName}
                />
              }
              title={getTitleFromUrl(pathname)}
              logo={
                !hideLogo(pathname) && (
                  <Box
                    height="headerContainerHeight"
                    margin="auto"
                    px="space.02"
                    hideBelow={variant === 'home' || isSessionLocked ? undefined : 'sm'}
                    hideFrom={isSessionLocked ? 'sm' : undefined}
                  >
                    <Logo
                      data-testid={OnboardingSelectors.LogoRouteToHome}
                      onClick={variant !== 'home' ? () => navigate(RouteUrls.Home) : undefined}
                    />
                  </Box>
                )
              }
              account={
                showAccountInfo(pathname) && (
                  <Flag
                    align="middle"
                    img={
                      <CurrentAccountAvatar
                        color="white"
                        fontSize="16px"
                        fontWeight={500}
                        size="32px"
                        toggleSwitchAccount={() =>
                          setIsShowingSwitchAccount(!isShowingSwitchAccount)
                        }
                      />
                    }
                  >
                    <CurrentAccountName />
                  </Flag>
                )
              }
              totalBalance={
                showAccountInfo(pathname) && (
                  <TotalBalance displayAddresssBalanceOf={getDisplayAddresssBalanceOf(pathname)} />
                )
              }
            />
          ) : null
        }
        variant={variant}
      >
        <Outlet />
      </ContainerLayout>
    </>
  );
}
