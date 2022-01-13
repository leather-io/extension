import { FiCheck } from 'react-icons/fi';
import { color, Box, Flex } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer';
import { Caption } from '@app/components/typography';
import ConnectLedgerSuccess from '@assets/images/onboarding/ledger/connect-ledger-success.png';

import { ConnectLedgerTitle } from '../components/connect-ledger-title';

interface ConnectLedgerSuccessLayoutProps {
  onCancelConnectLedger(): void;
}
export function ConnectLedgerSuccessLayout(props: ConnectLedgerSuccessLayoutProps) {
  const { onCancelConnectLedger } = props;

  return (
    <BaseDrawer title={<Box />} isShowing onClose={onCancelConnectLedger}>
      <Flex alignItems="center" flexDirection="column" pb="loose" textAlign="center">
        <Box mt="tight">
          <img src={ConnectLedgerSuccess} width="267px" />
        </Box>
        <ConnectLedgerTitle />
        <Flex alignItems="center" color={color('feedback-success')} flexDirection="row" my="base">
          <FiCheck />
          <Caption color="inherited" ml="tight">
            Connected!
          </Caption>
        </Flex>
      </Flex>
    </BaseDrawer>
  );
}
