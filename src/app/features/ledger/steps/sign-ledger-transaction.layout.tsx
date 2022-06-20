import { color, Box, Flex } from '@stacks/ui';

import SignLedgerTransaction from '@assets/images/ledger/sign-ledger-transaction.png';
import { DividerSeparator } from '@app/components/divider-separator';
import { LedgerTitle } from '../components/ledger-title';
import { LedgerWrapper } from '../components/ledger-wrapper';
import { LedgerScreenDetail } from '../components/ledger-screen-detail';
import { DeviceOperationApprovalStatus } from '../components/device-approval-status';

interface SignLedgerTransactionLayoutProps {
  details: [string, string, string?][];
  isFullPage: boolean;
  status: 'awaiting-approval' | 'approved';
}
export function SignLedgerTransactionLayout({
  details,
  isFullPage,
  status,
}: SignLedgerTransactionLayoutProps) {
  return (
    <LedgerWrapper>
      <Box mt="tight">
        <img src={SignLedgerTransaction} width="228px" />
      </Box>
      <LedgerTitle mt="loose" mx="50px">
        Verify the transaction details on your Ledger
      </LedgerTitle>
      <DeviceOperationApprovalStatus status={status} />
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
          {details.map(([title, value, tooltipLabel]) => (
            <LedgerScreenDetail isFullPage={isFullPage} title={title} tooltipLabel={tooltipLabel}>
              {value}
            </LedgerScreenDetail>
          ))}
        </DividerSeparator>
      </Flex>
    </LedgerWrapper>
  );
}
