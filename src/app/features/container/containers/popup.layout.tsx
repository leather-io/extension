import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box, Flex } from 'leather-styles/jsx';

import { Flag, Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { TotalBalance } from '../total-balance';
import {
  getDisplayAddresssBalanceOf,
  isRpcRoute,
  showAccountInfo,
  showBalanceInfo,
} from '../utils/get-popup-header';
import { getTitleFromUrl } from '../utils/get-title-from-url';
import { isNoHeaderPopup } from '../utils/route-helpers';
import { Header } from './headers/header';

interface PopupLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function PopupLayout({ children }: PopupLayoutProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

  const displayHeader = !isNoHeaderPopup(pathname);

  const isLogoClickable = !isRpcRoute(pathname);
  return (
    <Flex
      data-testid="main-container"
      flexDirection="column"
      flexGrow={1}
      width="100%"
      height={{ base: '100vh', sm: '100%' }}
    >
      {displayHeader && (
        <Header
          networkBadge={
            <NetworkModeBadge
              isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
              name={chainName}
            />
          }
          title={getTitleFromUrl(pathname)}
          logo={
            //  PETE check this and improve - why no logo here, can't rememebr
            pathname !== RouteUrls.RpcGetAddresses && (
              <Box height="headerPopupHeight" margin="auto" px="space.02">
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
      )}
      <Flex className="main-content" flexGrow={1} position="relative" width="100%">
        {children}
      </Flex>
    </Flex>
  );
}
