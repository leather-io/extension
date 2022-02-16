import { color, Box, Flex, Text } from '@stacks/ui';

import SignLedgerTransaction from '@assets/images/ledger/sign-ledger-transaction.png';
import { Caption } from '@app/components/typography';
import { DividerSeparator } from '@app/components/divider-separator';
import { LedgerTitle } from '../components/ledger-title';
import { LookingForLedgerLabel } from '../components/looking-for-ledger-label';
import { LedgerWrapper } from '../components/ledger-wrapper';
import { LedgerSuccessLabel } from '../components/success-label';

interface TransactionDetailProps {
  title: string;
  children: React.ReactNode;
}
function TransactionDetail(props: TransactionDetailProps) {
  return (
    <Flex borderColor="#DCDDE2" flexDirection="column">
      <Caption>{props.title}</Caption>
      <Text mt="base" overflowWrap="break-word">
        {props.children}
      </Text>
    </Flex>
  );
}

interface SignLedgerTransactionLayoutProps {
  details: [string, string][];
  status: 'awaiting-approval' | 'approved';
}
export function SignLedgerTransactionLayout({ details, status }: SignLedgerTransactionLayoutProps) {
  return (
    <LedgerWrapper>
      <Box mt="tight">
        <img src={SignLedgerTransaction} width="228px" />
      </Box>
      <LedgerTitle mt="loose" mx="50px">
        Verify the transaction details on your Ledger
      </LedgerTitle>
      {status === 'awaiting-approval' && (
        <LookingForLedgerLabel my="extra-loose">Waiting for your approval</LookingForLedgerLabel>
      )}
      {status === 'approved' && <LedgerSuccessLabel my="extra-loose">Approved</LedgerSuccessLabel>}
      <Flex
        bg={color('bg-4')}
        borderRadius="16px"
        flexDirection="column"
        textAlign="left"
        px="extra-loose"
        py="extra-loose"
        width="100%"
      >
        <DividerSeparator>
          {details.map(([title, value]) => (
            <TransactionDetail title={title}>{value}</TransactionDetail>
          ))}
        </DividerSeparator>
      </Flex>
    </LedgerWrapper>
  );
}
