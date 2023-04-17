import { ChainID } from '@stacks/transactions';
import { Box } from '@stacks/ui';

import { whenStacksChainId } from '@app/common/utils';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption } from '@app/components/typography';

interface NetworkRowProps {
  chainId: ChainID;
}
export function NetworkRow({ chainId }: NetworkRowProps) {
  return (
    <Box spacing="base">
      <SpaceBetween position="relative">
        <Box alignItems="center">
          <Caption>No fees will be incurred</Caption>
        </Box>
        <Caption>
          <span>
            {whenStacksChainId(chainId)({
              [ChainID.Testnet]: 'Testnet',
              [ChainID.Mainnet]: 'Mainnet',
            })}
          </span>
        </Caption>
      </SpaceBetween>
    </Box>
  );
}
