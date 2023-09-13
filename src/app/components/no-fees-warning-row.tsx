import { ChainID } from '@stacks/transactions';
import { styled } from 'leather-styles/jsx';

import { whenStacksChainId } from '@app/common/utils';
import { SpaceBetween } from '@app/components/layout/space-between';

interface NoFeesWarningRowProps {
  chainId: ChainID;
}
export function NoFeesWarningRow({ chainId }: NoFeesWarningRowProps) {
  return (
    <SpaceBetween>
      <styled.span textStyle="caption.02">No fees are incurred</styled.span>
      <styled.span textStyle="caption.02">
        {whenStacksChainId(chainId)({
          [ChainID.Testnet]: 'Testnet',
          [ChainID.Mainnet]: 'Mainnet',
        })}
      </styled.span>
    </SpaceBetween>
  );
}
