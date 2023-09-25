import { ChainID } from '@stacks/transactions';
import { HStack, styled } from 'leather-styles/jsx';

import { whenStacksChainId } from '@app/common/utils';

interface NoFeesWarningRowProps {
  chainId: ChainID;
}
export function NoFeesWarningRow({ chainId }: NoFeesWarningRowProps) {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <styled.span textStyle="caption.02">No fees are incurred</styled.span>
      <styled.span textStyle="caption.02">
        {whenStacksChainId(chainId)({
          [ChainID.Testnet]: 'Testnet',
          [ChainID.Mainnet]: 'Mainnet',
        })}
      </styled.span>
    </HStack>
  );
}
