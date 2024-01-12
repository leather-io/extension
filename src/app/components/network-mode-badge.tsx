import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { Flex, FlexProps, styled } from 'leather-styles/jsx';

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
      _hover={{ cursor: 'pointer' }}
      alignItems="center"
      border="subdued"
      borderRadius="xs"
      height="24px"
      onClick={() => navigate(RouteUrls.SelectNetwork, { relative: 'path' })}
      px="space.03"
      position="relative"
      zIndex={999}
      {...props}
    >
      <styled.span color="accent.text-subdued" textStyle="label.03">
        {name}
      </styled.span>
    </Flex>
  );
});
