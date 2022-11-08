import { useContext } from 'react';

import SignLedgerTransaction from '@assets/images/ledger/sign-ledger-transaction.png';
import { Box, Flex, color } from '@stacks/ui';

import { DeviceOperationApprovalStatus } from '@app/features/ledger/components/device-approval-status';
import { LedgerScreenDetail } from '@app/features/ledger/components/ledger-screen-detail';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';
import { ledgerJwtSigningContext } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.context';
import { useHasApprovedOperation } from '@app/features/ledger/hooks/use-has-approved-transaction';

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
          title="JWT Hash"
          tooltipLabel="This is a Sha256 hash of the JSON Web Token payload returned to the connecting app, which proves to the app you own the corresponding private key"
        >
          {jwtPayloadHash}
        </LedgerScreenDetail>
      </Flex>
    </LedgerWrapper>
  );
}
