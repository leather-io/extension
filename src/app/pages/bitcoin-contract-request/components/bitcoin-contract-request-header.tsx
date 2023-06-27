import { memo } from 'react';

import { Flex } from '@stacks/ui';

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
    <Flex flexDirection="column" my="loose" width="100%">
      <Title fontSize={3} fontWeight={500} mb="base">
        Lock Bitcoin
      </Title>
      {caption && (
        <Flag
          align="middle"
          img={<img src={counterpartyWalletIcon} height="32px" width="32px" />}
          pl="tight"
        >
          <Caption wordBreak="break-word">{caption}</Caption>
        </Flag>
      )}
    </Flex>
  );
}

export const BitcoinContractRequestHeader = memo(BitcoinContractRequestHeaderBase);
