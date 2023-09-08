import LedgerTxRejected from '@assets/images/ledger/transaction-rejected.png';
import { Box, Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LeatherButton } from '@app/components/button/button';

import { LedgerTitle } from '../../components/ledger-title';

interface LedgerOperationRejectedLayoutProps {
  description: string;
  onClose(): void;
}
export function LedgerOperationRejectedLayout({
  onClose,
  description,
}: LedgerOperationRejectedLayoutProps) {
  return (
    <Flex alignItems="center" flexDirection="column" pb="space.06" px="space.05" textAlign="center">
      <Box>
        <img src={LedgerTxRejected} width="227px" height="63px" />
      </Box>
      <LedgerTitle mt="space.06" mx="40px" lineHeight="1.6">
        {description}
      </LedgerTitle>
      <styled.span
        mt="space.03"
        lineHeight="24px"
        color={token('colors.accent.text-subdued')}
      ></styled.span>
      <LeatherButton variant="ghost" mt="space.04" mr="space.03" mb="space.02" onClick={onClose}>
        Close
      </LeatherButton>
    </Flex>
  );
}
