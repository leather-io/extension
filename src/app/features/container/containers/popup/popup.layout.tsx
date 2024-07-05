import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box } from 'leather-styles/jsx';

import { Flag, Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { TotalBalance } from '../../total-balance';
import { ContainerLayout } from '../container.layout';
import { PopupHeader } from './popup-header';

function isNoHeaderPopup(pathname: RouteUrls) {
  return pathname === RouteUrls.RpcGetAddresses || pathname === RouteUrls.ChooseAccount;
}

function showAccountInfo(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
      return true;
    default:
      return false;
  }
}

function showBalanceInfo(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
      return true;
    case RouteUrls.TransactionRequest:
    default:
      return false;
  }
}

function getDisplayAddresssBalanceOf(pathname: RouteUrls) {
  //  TODO it's unclear when to show ALL or STX balance here
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
      return 'all';
    default:
      return 'stx';
  }
}

interface PopupLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function PopupLayout({ children }: PopupLayoutProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

  const displayHeader = !isNoHeaderPopup(pathname);

  return (
    <ContainerLayout
      header={
        displayHeader ? (
          <PopupHeader
            networkBadge={
              <NetworkModeBadge
                isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                name={chainName}
              />
            }
            logo={
              //  PETE check this and improve - why no logo here, can't rememebr
              pathname !== RouteUrls.RpcGetAddresses && (
                <Box height="headerPopupHeight" margin="auto" px="space.02">
                  <Logo
                    data-testid={OnboardingSelectors.LogoRouteToHome}
                    // onClick={isLogoClickable ? () => navigate(RouteUrls.Home) : undefined}
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
        ) : undefined
      }
      content={children}
    />
  );
}
