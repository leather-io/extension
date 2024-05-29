import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Flag, HamburgerIcon, Header, Logo, NetworkModeBadge } from '@leather-wallet/ui';
import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box } from 'leather-styles/jsx';

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

import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { Settings } from '../settings/settings';
import { ContainerLayout } from './container.layout';
import { TotalBalance } from './total-balance';
import {
  getDisplayAddresssBalanceOf,
  isKnownPopupRoute,
  isRpcRoute,
  showAccountInfo,
  showBalanceInfo,
} from './utils/get-popup-header';
import { getTitleFromUrl } from './utils/get-title-from-url';
import {
  canGoBack,
  getIsSessionLocked,
  getPageVariant,
  hideLogo,
  hideSettingsOnSm,
  isLandingPage,
  isNoHeaderPopup,
  isSummaryPage,
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

  const displayHeader = !isLandingPage(pathname) && !isNoHeaderPopup(pathname);
  const isSessionLocked = getIsSessionLocked(pathname);

  // TODO: Refactor? This is very hard to manage with dynamic routes. Temporarily
  // added a fix to catch the swap route: '/swap/:base/:quote?'
  function getOnGoBackLocation(pathname: RouteUrls) {
    if (pathname.includes('/swap')) return navigate(RouteUrls.Home);
    switch (pathname) {
      case RouteUrls.Fund.replace(':currency', 'STX'):
      case RouteUrls.Fund.replace(':currency', 'BTC'):
      case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'):
      case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'):
        return navigate(RouteUrls.Home);
      case RouteUrls.SendStxConfirmation:
        return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'));
      case RouteUrls.SendBtcConfirmation:
        return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'));
      default:
        return navigate(-1);
    }
  }

  if (!hasStateRehydrated) return <LoadingSpinner />;

  const showLogoSm = variant === 'home' || isSessionLocked || isKnownPopupRoute(pathname);
  const hideSettings =
    isKnownPopupRoute(pathname) || isSummaryPage(pathname) || variant === 'onboarding';

  const isLogoClickable = variant !== 'home' && !isRpcRoute(pathname);
  return (
    <>
      {isShowingSwitchAccount && (
        <SwitchAccountDialog
          isShowing={isShowingSwitchAccount}
          onClose={() => setIsShowingSwitchAccount(false)}
        />
      )}

      <InAppMessages />
      <ContainerLayout
        header={
          displayHeader ? (
            <Header
              variant={variant}
              onGoBack={canGoBack(pathname) ? () => getOnGoBackLocation(pathname) : undefined}
              onClose={isSummaryPage(pathname) ? () => navigate(RouteUrls.Home) : undefined}
              settingsMenu={
                hideSettings ? null : (
                  <Settings
                    triggerButton={
                      <HamburgerIcon
                        data-testid={SettingsSelectors.SettingsMenuBtn}
                        hideBelow={hideSettingsOnSm(pathname) ? 'sm' : undefined}
                      />
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
                    hideBelow={showLogoSm ? undefined : 'sm'}
                    hideFrom={isSessionLocked ? 'sm' : undefined}
                  >
                    <Logo
                      data-testid={OnboardingSelectors.LogoRouteToHome}
                      onClick={isLogoClickable ? () => navigate(RouteUrls.Home) : undefined}
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
                showBalanceInfo(pathname) && (
                  <TotalBalance displayAddresssBalanceOf={getDisplayAddresssBalanceOf(pathname)} />
                )
              }
            />
          ) : null
        }
      >
        <Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />
      </ContainerLayout>
    </>
  );
}
