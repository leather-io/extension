import { Outlet } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { Box } from 'leather-styles/jsx';

import { Logo, NetworkModeBadge } from '@leather.io/ui';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { ContainerLayout } from './components/container.layout';
import { HomeHeader } from './components/home-header';

export function HomeLayout() {
  const { chain, name: chainName } = useCurrentNetworkState();

  return (
    <ContainerLayout
      header={
        <HomeHeader
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
      content={<Outlet />}
    />
  );
}
