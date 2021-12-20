import { useCallback } from 'react';

import { Caption, Title } from '@app/components/typography';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useWallet } from '@app/common/hooks/use-wallet';
import { getUrlHostname } from '@app/common/utils';
import { Box, BoxProps, color, Flex, Stack } from '@stacks/ui';
import { useUpdateCurrentNetworkKey } from '@app/store/network/networks.hooks';
import { NetworkStatusIndicator } from './components/network-status-indicator';
import { useNetworkStatus } from '@app/query/network/network.hooks';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

interface NetworkListItemProps extends BoxProps {
  item: string;
}
export const NetworkListItem = ({ item, ...props }: NetworkListItemProps) => {
  const { setShowNetworks } = useDrawers();
  const { networks, currentNetworkKey } = useWallet();
  const setCurrentNetworkKey = useUpdateCurrentNetworkKey();
  const network = networks[item];
  const isActive = item === currentNetworkKey;
  const isOnline = useNetworkStatus(network.url);
  const analytics = useAnalytics();

  const handleItemClick = useCallback(() => {
    void analytics.track('change_network');
    setCurrentNetworkKey(item);
    setTimeout(() => setShowNetworks(false), 25);
  }, [analytics, setCurrentNetworkKey, item, setShowNetworks]);

  return (
    <Box
      width="100%"
      key={item}
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
        <NetworkStatusIndicator isActive={item === currentNetworkKey} isOnline={isOnline} />
      </Flex>
    </Box>
  );
};
