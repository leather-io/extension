import React from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { BaseDrawerProps, BaseDrawer } from '.';
import { useWallet } from '@common/hooks/use-wallet';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useDispatch } from '@common/hooks/use-dispatch';
import { doChangeNetwork } from '@store/wallet/actions';

export const NetworksDrawer: React.FC<BaseDrawerProps> = ({ showing, close }) => {
  const { networks, currentNetworkKey } = useWallet();
  const { doChangeScreen } = useAnalytics();
  const dispatch = useDispatch();
  const networkRows = Object.keys(networks).map(networkKey => {
    const network = networks[networkKey];
    return (
      <Box
        width="100%"
        key={networkKey}
        _hover={{
          backgroundColor: 'ink.150',
        }}
        cursor="pointer"
        px={6}
        py="base"
        onClick={() => {
          dispatch(doChangeNetwork(networkKey));
          close();
        }}
      >
        <Flex width="100%">
          <Box flexGrow={1}>
            <Text fontSize={2} display="block">
              {network.name}
            </Text>
            <Text fontSize={1} color="gray">
              {network.url}
            </Text>
          </Box>
          <Box pt="base-loose">{networkKey === currentNetworkKey ? <CheckmarkIcon /> : null}</Box>
        </Flex>
      </Box>
    );
  });
  return (
    <BaseDrawer showing={showing} close={close}>
      <Box width="100%" px={6}>
        <Text fontSize={4} fontWeight="600">
          Select Network
        </Text>
      </Box>
      <Flex flexWrap="wrap" flexDirection="column">
        {networkRows}
      </Flex>
      <Box width="100%" px={6}>
        <Button onClick={() => doChangeScreen(ScreenPaths.ADD_NETWORK)}>Add a network</Button>
      </Box>
    </BaseDrawer>
  );
};
