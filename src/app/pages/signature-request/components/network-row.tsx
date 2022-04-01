import { whenChainId } from '@app/common/transactions/transaction-utils';
import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';
import { StacksNetwork } from '@stacks/network';
import { ChainID } from '@stacks/transactions';
import { Box } from '@stacks/ui';

interface NetworkRowProps {
  network: StacksNetwork;
}
export function NetworkRow(props: NetworkRowProps): JSX.Element | null {
  const { network } = props;

  return (
    <Box spacing="base">
      <SpaceBetween position="relative">
        <Box alignItems="center" isInline>
          <Caption>No fees will be incured</Caption>
        </Box>
        <Caption>
          <span>
            {whenChainId(network.chainId)({
              [ChainID.Testnet]: 'Testnet',
              [ChainID.Mainnet]: 'Mainnet',
            })}
          </span>
        </Caption>
      </SpaceBetween>
    </Box>
  );
}
