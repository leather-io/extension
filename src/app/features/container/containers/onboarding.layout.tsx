import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flag, HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';
import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { Settings } from '../../settings/settings';
import { TotalBalance } from '../total-balance';
import {
  getDisplayAddresssBalanceOf,
  isKnownPopupRoute,
  isRpcRoute,
  showAccountInfo,
  showBalanceInfo,
} from '../utils/get-popup-header';
import { getTitleFromUrl } from '../utils/get-title-from-url';
import {
  canGoBack,
  getIsSessionLocked,
  getPageVariant,
  hideLogo,
  hideSettingsOnSm,
  isLandingPage,
  isNoHeaderPopup,
  isSummaryPage,
} from '../utils/route-helpers';
import { ContainerLayout } from './container.layout';
import { Header } from './headers/header';

interface OnboardingLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

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
  const showLogoSm = variant === 'home' || isSessionLocked || isKnownPopupRoute(pathname);
  const hideSettings =
    isKnownPopupRoute(pathname) || isSummaryPage(pathname) || variant === 'onboarding';

  const isLogoClickable = variant !== 'home' && !isRpcRoute(pathname);
  return (
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
                      toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
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
      content={children}
    />
  );
}
