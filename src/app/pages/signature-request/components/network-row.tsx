import { whenChainId } from '@app/common/transactions/transaction-utils';
import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';

import { ChainID } from '@stacks/transactions';
import { Box } from '@stacks/ui';

interface NetworkRowProps {
  chainId: ChainID;
}
export function NetworkRow(props: NetworkRowProps): JSX.Element | null {
  const { chainId } = props;

  return (
    <Box spacing="base">
      <SpaceBetween position="relative">
        <Box alignItems="center" isInline>
          <Caption>No fees will be incured</Caption>
        </Box>
        <Caption>
          <span>
            {whenChainId(chainId)({
              [ChainID.Testnet]: 'Testnet',
              [ChainID.Mainnet]: 'Mainnet',
            })}
          </span>
        </Caption>
      </SpaceBetween>
    </Box>
  );
}
