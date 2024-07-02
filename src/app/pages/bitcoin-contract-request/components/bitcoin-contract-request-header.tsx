import { memo } from 'react';

import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { Flex } from 'leather-styles/jsx';

import { Caption, Flag, Title } from '@leather.io/ui';

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
    <Flex flexDirection="column" my="space.05" width="100%">
      <Title mb="space.04">Lock Bitcoin</Title>
      {caption && (
        <Flag img={<img src={counterpartyWalletIcon} height="32px" width="32px" />} pl="space.02">
          <Caption data-testid={BitcoinContractRequestSelectors.BitcoinContractOfferorText}>
            {caption}
          </Caption>
        </Flag>
      )}
    </Flex>
  );
}

export const BitcoinContractRequestHeader = memo(BitcoinContractRequestHeaderBase);
