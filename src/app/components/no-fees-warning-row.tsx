import { ChainID } from '@stacks/transactions';
import { HStack, styled } from 'leather-styles/jsx';

import { stacksChainIdToCoreNetworkMode } from '@leather.io/stacks';

import { capitalize } from '@app/common/utils';

interface NoFeesWarningRowProps {
  chainId: ChainID;
}
export function NoFeesWarningRow({ chainId }: NoFeesWarningRowProps) {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <styled.span textStyle="caption.01">No fees are incurred</styled.span>
      <styled.span textStyle="caption.01">
        {capitalize(stacksChainIdToCoreNetworkMode(chainId))}
      </styled.span>
    </HStack>
  );
}
