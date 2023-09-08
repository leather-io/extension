import SignLedgerTransaction from '@assets/images/ledger/sign-ledger-transaction.png';
import { Box, Flex } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { DividerSeparator } from '@app/components/layout/divider-separator';

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
        <img src={SignLedgerTransaction} width="228px" />
      </Box>
      <LedgerTitle mt="space.05" mx="50px">
        {description}
      </LedgerTitle>
      <DeviceOperationApprovalStatus status={status} />
      <Flex
        bg={token('colors.accent.background-secondary')}
        borderRadius="16px"
        flexDirection="column"
        textAlign="left"
        px="space.06"
        py="space.06"
        width="100%"
      >
        <DividerSeparator>
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
