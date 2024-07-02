import { Box, HStack } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';
import { LedgerIlluDisconnected } from '../../illustrations/ledger-illu-disconnected';

interface LedgerDisconnectedLayoutProps {
  onConnectAgain(): void;
  onClose(): void;
}
export function LedgerDisconnectedLayout(props: LedgerDisconnectedLayoutProps) {
  const { onConnectAgain, onClose } = props;
  return (
    <LedgerWrapper>
      <Box>
        <LedgerIlluDisconnected width="242px" />
      </Box>
      <LedgerTitle my="space.05">Your Ledger has disconnected</LedgerTitle>
      <HStack width="100%">
        <Button flex={1} variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button flex={1} onClick={onConnectAgain}>
          Connect again
        </Button>
      </HStack>
    </LedgerWrapper>
  );
}
