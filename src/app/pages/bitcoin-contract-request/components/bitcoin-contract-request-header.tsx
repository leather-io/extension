import { memo } from 'react';

import { Flex } from 'leather-styles/jsx';

import { Flag } from '@app/components/layout/flag';
import { Caption, Title } from '@app/components/typography';

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
      <Title fontSize={4} fontWeight="bold" mb="space.04">
        Lock Bitcoin
      </Title>
      {caption && (
        <Flag
          align="middle"
          img={<img src={counterpartyWalletIcon} height="32px" width="32px" />}
          pl="space.02"
        >
          <Caption>{caption}</Caption>
        </Flag>
      )}
    </Flex>
  );
}

export const BitcoinContractRequestHeader = memo(BitcoinContractRequestHeaderBase);
