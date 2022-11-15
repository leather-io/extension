import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { Flex, FlexProps, Text, color } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export const NetworkModeBadge = memo((props: FlexProps) => {
  const navigate = useNavigate();
  const { chain, name } = useCurrentNetworkState();
  const isTestnetChain = useMemo(
    () => chain.stacks.chainId === ChainID.Testnet,
    [chain.stacks.chainId]
  );

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
