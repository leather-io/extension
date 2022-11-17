import SignLedgerTransaction from '@assets/images/ledger/sign-ledger-transaction.png';
import { Box, Flex, color } from '@stacks/ui';

import { DividerSeparator } from '@app/components/divider-separator';

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
      <Box mt="tight">
        <img src={SignLedgerTransaction} width="228px" />
      </Box>
      <LedgerTitle mt="loose" mx="50px">
        {description}
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
        <DividerSeparator my="base-loose">
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
