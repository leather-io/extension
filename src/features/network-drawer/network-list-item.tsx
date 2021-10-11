import {
  useNetworkOnlineStatusState,
  useUpdateCurrentNetworkKey,
} from '@store/network/networks.hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { FiCloudOff as IconCloudOff } from 'react-icons/fi';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { Box, BoxProps, color, Flex, Spinner, Stack } from '@stacks/ui';
import { useDrawers } from '@common/hooks/use-drawers';
import { useWallet } from '@common/hooks/use-wallet';
import { Caption, Title } from '@components/typography';
import { getUrlHostname } from '@common/utils';

interface OnlineIndicatorProps {
  isOnline: boolean;
  isActive: boolean;
  setIsOnline: (value: boolean) => void;
  network: {
    url: string;
  };
}

const OnlineIndicator = ({ isOnline, setIsOnline, network, isActive }: OnlineIndicatorProps) => {
  const networkStatus = useNetworkOnlineStatusState(network.url);
  useEffect(() => {
    if (isOnline !== networkStatus.isOnline) setIsOnline(networkStatus.isOnline);
  }, [isOnline, networkStatus.isOnline, setIsOnline]);
  return !networkStatus?.isOnline ? <IconCloudOff /> : isActive ? <CheckmarkIcon /> : null;
};

export const NetworkListItem: React.FC<{ item: string } & BoxProps> = ({ item, ...props }) => {
  const { setShowNetworks } = useDrawers();
  const { networks, currentNetworkKey } = useWallet();
  const setCurrentNetworkKey = useUpdateCurrentNetworkKey();
  const network = networks[item];
  const [isOnline, setIsOnline] = useState(false);
  const isActive = item === currentNetworkKey;

  const handleItemClick = useCallback(() => {
    setCurrentNetworkKey(item);
    setTimeout(() => setShowNetworks(false), 25);
  }, [setCurrentNetworkKey, item, setShowNetworks]);

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
        <React.Suspense
          key={item}
          fallback={
            <Flex alignItems="center" justifyContent="center">
              <Spinner size="sm" />
            </Flex>
          }
        >
          <OnlineIndicator
            isActive={item === currentNetworkKey}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            network={network}
          />
        </React.Suspense>
      </Flex>
    </Box>
  );
};
