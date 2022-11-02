import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { color, Flex, FlexProps, Text } from '@stacks/ui';
import { ChainID } from '@stacks/transactions';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { RouteUrls } from '@shared/route-urls';

export const NetworkModeBadge = memo((props: FlexProps) => {
  const navigate = useNavigate();
  const { chainId, name } = useCurrentNetworkState();
  const isTestnetChain = useMemo(() => chainId === ChainID.Testnet, [chainId]);

  if (!isTestnetChain) return null;

  return (
    <Flex
      borderWidth="1px"
      borderColor={color('border')}
      borderRadius="12px"
      height="24px"
      alignItems="center"
      px="12px"
      position="relative"
      zIndex={999}
      _hover={{ cursor: 'pointer', bg: color('bg-4') }}
      onClick={() => navigate(RouteUrls.SelectNetwork, { relative: 'path' })}
      {...props}
    >
      <Text fontSize="11px" fontWeight="500">
        {name}
      </Text>
    </Flex>
  );
});
