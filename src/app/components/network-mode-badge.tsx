import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { Flex, FlexProps } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { Tag } from '@app/ui/components/tag/tag';

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
      onClick={() => navigate(RouteUrls.SelectNetwork, { relative: 'path' })}
      position="relative"
      zIndex={999}
      {...props}
    >
      <Tag label={name} transparent />
    </Flex>
  );
});
