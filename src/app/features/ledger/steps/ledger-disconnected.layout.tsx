import { Box, Button, Stack } from '@stacks/ui';
import { PrimaryButton } from '@app/components/primary-button';
import LedgerDisconnected from '@assets/images/ledger/ledger-disconnected.png';

import { LedgerTitle } from '../components/ledger-title';
import { LedgerWrapper } from '../components/ledger-wrapper';

interface LedgerDisconnectedLayoutProps {
  onConnectAgain(): void;
  onClose(): void;
}
export function LedgerDisconnectedLayout(props: LedgerDisconnectedLayoutProps) {
  const { onConnectAgain, onClose } = props;
  return (
    <LedgerWrapper>
      <Box mb="loose" mt="tight">
        <img src={LedgerDisconnected} width="242px" />
      </Box>
      <LedgerTitle mb="loose" mt="loose" mx="40px">
        Your Ledger has disconnected
      </LedgerTitle>
      <Stack isInline mb="loose">
        <Button
          _hover={{ boxShadow: 'none' }}
          borderRadius="10px"
          boxShadow="none"
          mode="tertiary"
          onClick={onClose}
        >
          Close
        </Button>
        <PrimaryButton height="40px" onClick={onConnectAgain}>
          Connect again
        </PrimaryButton>
      </Stack>
    </LedgerWrapper>
  );
}
