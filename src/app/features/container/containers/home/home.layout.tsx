import { Outlet } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box } from 'leather-styles/jsx';

import { HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { Settings } from '../../../settings/settings';
import { ContainerLayout } from '../container.layout';
import { HomeHeader } from './home-header';

// props are optional as populated by the outlet context
interface HomeLayoutProps {
  isShowingSwitchAccount?: boolean;
  setIsShowingSwitchAccount?(isShowingSwitchAccount: boolean): void;
}

export function HomeLayout({ isShowingSwitchAccount, setIsShowingSwitchAccount }: HomeLayoutProps) {
  const { chain, name: chainName } = useCurrentNetworkState();
  return (
    <ContainerLayout
      header={
        <HomeHeader
          settingsMenu={
            // this toggleSwitchAccount is not working now, come up with a more elegant solution in container
            <Settings
              triggerButton={<HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
              toggleSwitchAccount={
                setIsShowingSwitchAccount
                  ? () => setIsShowingSwitchAccount(!isShowingSwitchAccount)
                  : () => null
              }
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
        />
      }
      content={<Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />}
    />
  );
}
