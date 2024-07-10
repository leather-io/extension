import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { Box } from 'leather-styles/jsx';

import { Flag, Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { TotalBalance } from '../total-balance';
import { ContainerLayout } from './components/container.layout';
import { PopupHeader } from './components/popup-header';

function showHeader(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.RpcGetAddresses:
    case RouteUrls.ChooseAccount:
      return false;
    default:
      return true;
  }
}

function showAccountInfo(pathname: RouteUrls) {
  switch (pathname) {
    case RouteUrls.TransactionRequest:
    case RouteUrls.ProfileUpdateRequest:
    case RouteUrls.RpcSendTransfer:
    case RouteUrls.RpcSignPsbt:
    case RouteUrls.RpcSignBip322Message:
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
    default:
      return false;
  }
}

export function PopupLayout() {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

  const isHeaderVisible = showHeader(pathname);

  return (
    <>
      {isShowingSwitchAccount && (
        <SwitchAccountDialog
          isShowing={isShowingSwitchAccount}
          onClose={() => setIsShowingSwitchAccount(false)}
        />
      )}
      <ContainerLayout
        header={
          isHeaderVisible ? (
            <PopupHeader
              networkBadge={
                <NetworkModeBadge
                  isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                  name={chainName}
                />
              }
              logo={
                <Box height="headerPopupHeight" margin="auto" px="space.02">
                  <Logo />
                </Box>
              }
              account={
                showAccountInfo(pathname) && (
                  <Flag
                    align="middle"
                    img={<CurrentAccountAvatar />}
                    onClick={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                    cursor="pointer"
                  >
                    <CurrentAccountName />
                  </Flag>
                )
              }
              totalBalance={
                // We currently only show displayAddresssBalanceOf="all" in the total balance component
                showBalanceInfo(pathname) && <TotalBalance displayAddresssBalanceOf="all" />
              }
            />
          ) : undefined
        }
        content={<Outlet />}
      />
    </>
  );
}
