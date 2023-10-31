import { memo } from 'react';

import { Flex } from '@stacks/ui';
import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';

import { Flag } from '@app/components/layout/flag';
import { Caption } from '@app/ui/components/typography/caption';
import { Title } from '@app/ui/components/typography/title';

interface BitcoinContractRequestHeaderBaseProps {
  counterpartyWalletIcon: string;
  counterpartyWalletName: string;
}

function BitcoinContractRequestHeaderBase({
  counterpartyWalletName,
  counterpartyWalletIcon,
}: BitcoinContractRequestHeaderBaseProps) {
  const caption = `${counterpartyWalletName} is requesting you accept this offer`;

  return (
    <Flex flexDirection="column" my="loose" width="100%">
      <Title mb="space.04">Lock Bitcoin</Title>
      {caption && (
        <Flag
          align="middle"
          img={<img src={counterpartyWalletIcon} height="32px" width="32px" />}
          pl="tight"
        >
          <Caption data-testid={BitcoinContractRequestSelectors.BitcoinContractOfferorText}>
            {caption}
          </Caption>
        </Flag>
      )}
    </Flex>
  );
}

export const BitcoinContractRequestHeader = memo(BitcoinContractRequestHeaderBase);
