import { useContext } from 'react';

import { useHasApprovedOperation } from '@app/features/ledger/hooks/use-has-approved-transaction';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { Box, color, Flex } from '@stacks/ui';
import { LedgerScreenDetail } from '@app/features/ledger/components/ledger-screen-detail';
import { ledgerJwtSigningContext } from '@app/features/ledger/ledger-jwt-signing.context';
import { DeviceOperationApprovalStatus } from '@app/features/ledger/components/device-approval-status';
import SignLedgerTransaction from '@assets/images/ledger/sign-ledger-transaction.png';

export function SignJwtHash() {
  const { jwtPayloadHash } = useContext(ledgerJwtSigningContext);
  const hasApprovedOperation = useHasApprovedOperation();

  return (
    <LedgerWrapper>
      <Box mt="tight">
        <img src={SignLedgerTransaction} width="228px" />
      </Box>
      <LedgerTitle mt="loose" mx="50px">
        Approve the JWT hash on your device
      </LedgerTitle>
      <DeviceOperationApprovalStatus
        status={hasApprovedOperation ? 'approved' : 'awaiting-approval'}
      />
      <Flex
        bg={color('bg-4')}
        borderRadius="16px"
        flexDirection="column"
        textAlign="left"
        px="extra-loose"
        py="extra-loose"
        width="100%"
      >
        <LedgerScreenDetail
          isFullPage={false}
          title="JWT Hash"
          tooltipLabel="This is a Sha256 hash of the JSON Web Token payload returned to the connecting app, which proves to the app you own the corresponding private key"
        >
          {jwtPayloadHash}
        </LedgerScreenDetail>
      </Flex>
    </LedgerWrapper>
  );
}
