import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flag, HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';
import { ChainID } from '@stacks/transactions';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { Settings } from '../../settings/settings';
import { TotalBalance } from '../total-balance';
import {
  getDisplayAddresssBalanceOf,
  showAccountInfo,
  showBalanceInfo,
} from '../utils/get-popup-header';
import { canGoBack, hideSettingsOnSm, isSummaryPage } from '../utils/route-helpers';
import { ContainerLayout } from './container.layout';
import { HomeHeader } from './headers/home-header';

interface HomeLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function HomeLayout({ children }: HomeLayoutProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

  // TODO: Refactor? This is very hard to manage with dynamic routes. Temporarily
  // added a fix to catch the swap route: '/swap/:base/:quote?'
  //   function getOnGoBackLocation(pathname: RouteUrls) {
  //     if (pathname.includes('/swap')) return navigate(RouteUrls.Home);
  //     switch (pathname) {
  //       case RouteUrls.Fund.replace(':currency', 'STX'):
  //       case RouteUrls.Fund.replace(':currency', 'BTC'):
  //       case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'):
  //       case RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'):
  //         return navigate(RouteUrls.Home);
  //       case RouteUrls.SendStxConfirmation:
  //         return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'stx'));
  //       case RouteUrls.SendBtcConfirmation:
  //         return navigate(RouteUrls.SendCryptoAssetForm.replace(':symbol', 'btc'));
  //       default:
  //         return navigate(-1);
  //     }
  //   }

  return (
    <ContainerLayout
      header={
        // mistake here as shouldn't be able to go back on homepage I think
        <HomeHeader
          //   onGoBack={canGoBack(pathname) ? () => getOnGoBackLocation(pathname) : undefined}
          //   onClose={isSummaryPage(pathname) ? () => navigate(RouteUrls.Home) : undefined}
          settingsMenu={
            <Settings
              triggerButton={<HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
              toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
            />
          }
          networkBadge={
            <NetworkModeBadge
              isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
              name={chainName}
            />
          }
          logo={
            <Box height="headerContainerHeight" margin="auto" px="space.02">
              <Logo />
            </Box>
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
      }
      content={children}
    />
  );
}
