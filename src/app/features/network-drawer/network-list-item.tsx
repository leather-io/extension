import { useCallback } from 'react';
import { Box, BoxProps, color, Flex, Stack } from '@stacks/ui';

import { Caption, Title } from '@app/components/typography';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useWallet } from '@app/common/hooks/use-wallet';
import { getUrlHostname } from '@app/common/utils';
import { useNetworkStatus } from '@app/query/network/network.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useNetworksActions } from '@app/store/networks/networks.hooks';
import { defaultCurrentNetwork } from '@shared/constants';

import { NetworkStatusIndicator } from './components/network-status-indicator';

interface NetworkListItemProps extends BoxProps {
  networkId: string;
}
export const NetworkListItem = ({ networkId, ...props }: NetworkListItemProps) => {
  const { setShowNetworks } = useDrawers();
  const { networks, currentNetworkId } = useWallet();
  const network = networks[networkId] || defaultCurrentNetwork;
  const isActive = networkId === currentNetworkId;
  const isOnline = useNetworkStatus(network.url);
  const networksActions = useNetworksActions();
  const analytics = useAnalytics();

  const handleItemClick = useCallback(() => {
    void analytics.track('change_network');
    networksActions.changeNetwork(networkId);
    setTimeout(() => setShowNetworks(false), 25);
  }, [analytics, networkId, networksActions, setShowNetworks]);

  return (
    <Box
      width="100%"
      key={networkId}
      _hover={
        !isOnline || isActive
          ? undefined
          : {
              backgroundColor: color('bg-4'),
            }
      }
      px="loose"
      py="base"
      onClick={!isOnline || isActive ? undefined : handleItemClick}
      cursor={!isOnline ? 'not-allowed' : isActive ? 'default' : 'pointer'}
      opacity={!isOnline ? 0.5 : 1}
      {...props}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Stack>
          <Title
            fontWeight={400}
            lineHeight="1rem"
            fontSize={2}
            display="block"
            fontFamily="'Inter'"
          >
            {network.name}
          </Title>
          <Caption>{getUrlHostname(network.url)}</Caption>
        </Stack>
        <NetworkStatusIndicator isActive={isActive} isOnline={isOnline} />
      </Flex>
    </Box>
  );
};
