import { memo, useMemo } from 'react';
import { color, Flex, FlexProps, Text } from '@stacks/ui';
import { ChainID } from '@stacks/transactions';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export const NetworkModeBadge = memo((props: FlexProps) => {
  const { chainId, name } = useCurrentNetworkState();
  const isTestnetChain = useMemo(() => chainId === ChainID.Testnet, [chainId]);
  const { setShowNetworks } = useDrawers();

  return isTestnetChain ? (
    <Flex
      borderWidth="1px"
      borderColor={color('border')}
      borderRadius="12px"
      height="24px"
      alignItems="center"
      px="12px"
      position="relative"
      zIndex={999}
      _hover={{
        cursor: 'pointer',
        bg: color('bg-4'),
      }}
      onClick={() => setShowNetworks(true)}
      {...props}
    >
      <Text fontSize="11px" fontWeight="500">
        {name}
      </Text>
    </Flex>
  ) : null;
});
