import { Box, Flex } from 'leather-styles/jsx';

import { DividerSeparator } from '@app/components/layout/divider-separator';
import { SignLedgerTransaction } from '@app/features/ledger/illustrations/ledger-illu-sign-ledger-transaction';

import { DeviceOperationApprovalStatus } from '../../components/device-approval-status';
import { LedgerScreenDetail } from '../../components/ledger-screen-detail';
import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

interface ApproveLedgerOperationLayoutProps {
  description: string;
  details: [string, string, string?][];
  status: 'awaiting-approval' | 'approved';
}
export function ApproveLedgerOperationLayout(props: ApproveLedgerOperationLayoutProps) {
  const { description, details, status } = props;
  return (
    <LedgerWrapper>
      <Box mt="space.02">
        <SignLedgerTransaction />
      </Box>
      <LedgerTitle mt="space.05" mx="space.08">
        {description}
      </LedgerTitle>
      <DeviceOperationApprovalStatus status={status} />
      <Flex
        bg="ink.background-secondary"
        borderRadius="lg"
        flexDirection="column"
        px="space.06"
        py="space.06"
        textAlign="left"
        width="100%"
      >
        <DividerSeparator my="space.04">
          {details.map(([title, value, tooltipLabel]) => (
            <LedgerScreenDetail key={value} title={title} tooltipLabel={tooltipLabel}>
              {value}
            </LedgerScreenDetail>
          ))}
        </DividerSeparator>
      </Flex>
    </LedgerWrapper>
  );
}
