import { Box, Flex } from '@stacks/ui';

import { Divider } from '@app/components/divider';
import { BaseDrawer } from '@app/components/drawer';
import { Link } from '@app/components/link';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption } from '@app/components/typography';
import ConnectLedger from '@assets/images/onboarding/ledger/connect-ledger.png';
// import { WarningLabel } from '@app/components/warning-label';

import { LookingForLedger } from './components/looking-for-ledger';
import { ConnectLedgerTitle } from '../components/connect-ledger-title';

interface ConnectLedgerLayoutProps {
  isLookingForLedger: boolean;
  onCancelConnectLedger(): void;
  onConnectLedger(): void;
}
export function ConnectLedgerLayout(props: ConnectLedgerLayoutProps) {
  const { isLookingForLedger, onCancelConnectLedger, onConnectLedger } = props;

  return (
    <BaseDrawer title={<Box />} isShowing onClose={onCancelConnectLedger}>
      <Flex alignItems="center" flexDirection="column" pb="loose" textAlign="center">
        <Flex flexDirection="column">
          {/* TODO: Implement warning with actual ledger integration */}
          {/* <WarningLabel mb="loose">Before proceeding, close Ledger Live if it’s open</WarningLabel> */}
          <Box mt="base">
            <img src={ConnectLedger} width="331px" />
          </Box>
        </Flex>
        <ConnectLedgerTitle />
        {isLookingForLedger ? (
          <LookingForLedger />
        ) : (
          <>
            <PrimaryButton height="40px" mb="loose" onClick={onConnectLedger}>
              Connect
            </PrimaryButton>
            <Divider />
            <Caption mb="tight" mt="loose">
              First time using Ledger on Hiro Wallet?
            </Caption>
            <Link fontSize={1}>See how to download the Stacks app</Link>
          </>
        )}
      </Flex>
    </BaseDrawer>
  );
}
