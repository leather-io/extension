import { Outlet, useOutletContext } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box } from 'leather-styles/jsx';

import { HamburgerIcon, Logo, NetworkModeBadge } from '@leather.io/ui';

import { SwitchAccountOutletContext } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { Settings } from '../../../settings/settings';
import { ContainerLayout } from '../container.layout';
import { HomeHeader } from './home-header';

export function HomeLayout() {
  const { chain, name: chainName } = useCurrentNetworkState();

  const { isShowingSwitchAccount, setIsShowingSwitchAccount } =
    useOutletContext<SwitchAccountOutletContext>();

  return (
    <ContainerLayout
      header={
        <HomeHeader
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
        />
      }
      content={<Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />}
    />
  );
}
