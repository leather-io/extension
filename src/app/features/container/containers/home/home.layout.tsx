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
  children?: React.JSX.Element | React.JSX.Element[];
  isShowingSwitchAccount?: boolean;
  setIsShowingSwitchAccount?(isShowingSwitchAccount: boolean): void;
}

export function HomeLayout({
  children,
  isShowingSwitchAccount,
  setIsShowingSwitchAccount,
}: HomeLayoutProps) {
  const { chain, name: chainName } = useCurrentNetworkState();

  return (
    <ContainerLayout
      header={
        <HomeHeader
          settingsMenu={
            //  guard needed as setIsShowingSwitchAccount passed via cloning
            setIsShowingSwitchAccount ? (
              <Settings
                triggerButton={<HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
                toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
              />
            ) : undefined
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
      content={children}
    />
  );
}
