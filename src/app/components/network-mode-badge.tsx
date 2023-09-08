import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { Flex, FlexProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
      borderColor={token('colors.accent.non-interactive')}
      borderRadius="12px"
      height="24px"
      alignItems="center"
      px="12px"
      position="relative"
      zIndex={999}
      _hover={{ cursor: 'pointer' }}
      color={token('colors.accent.non-interactive')}
      onClick={() => navigate(RouteUrls.SelectNetwork, { relative: 'path' })}
      {...props}
    >
      <styled.span color={token('colors.accent.non-interactive')} fontSize="13px" fontWeight="500">
        {name}
      </styled.span>
    </Flex>
  );
});
