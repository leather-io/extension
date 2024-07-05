import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Flex } from 'leather-styles/jsx';

import { HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { Settings } from '../../settings/settings';
import { getTitleFromUrl } from '../utils/get-title-from-url';
import {
  canGoBack,
  getIsSessionLocked,
  hideSettingsOnSm,
  isSummaryPage,
} from '../utils/route-helpers';
import { Header } from './headers/header';

interface PageLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function PageLayout({ children }: PageLayoutProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

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
  const hideSettings = isSummaryPage(pathname);

  return (
    <Flex
      data-testid="main-container"
      flexDirection="column"
      flexGrow={1}
      width="100%"
      height={{ base: '100vh', sm: '100%' }}
    >
      <Header
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
          <Box
            height="headerContainerHeight"
            margin="auto"
            px="space.02"
            hideBelow={isSessionLocked ? undefined : 'sm'}
            hideFrom={isSessionLocked ? 'sm' : undefined}
          >
            <Logo
              data-testid={OnboardingSelectors.LogoRouteToHome}
              onClick={() => navigate(RouteUrls.Home)}
            />
          </Box>
        }
      />
      <Flex className="main-content" flexGrow={1} position="relative" width="100%">
        {children}
      </Flex>
    </Flex>
  );
}
