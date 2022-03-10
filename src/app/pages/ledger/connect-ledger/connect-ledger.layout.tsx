import { Box, Flex } from '@stacks/ui';

import { Divider } from '@app/components/divider';
import { BaseDrawer } from '@app/components/drawer';
import { Link } from '@app/components/link';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption } from '@app/components/typography';
import ConnectLedger from '@assets/images/ledger/connect-ledger.png';
// import { WarningLabel } from '@app/components/warning-label';

import { LookingForLedger } from './components/looking-for-ledger';
import { LedgerDrawerType, LedgerTitle } from '../components/ledger-title';

interface ConnectLedgerLayoutProps {
  isLookingForLedger: boolean;
  awaitingLedgerConnection: boolean;
  warning: React.ReactNode;
  onCancelConnectLedger(): void;
  onConnectLedger(): void;
}
export function ConnectLedgerLayout(props: ConnectLedgerLayoutProps) {
  const {
    isLookingForLedger,
    onCancelConnectLedger,
    onConnectLedger,
    warning,
    awaitingLedgerConnection,
  } = props;

  return (
    <BaseDrawer title={<Box />} isShowing onClose={onCancelConnectLedger}>
      <Flex alignItems="center" flexDirection="column" pb="loose" px="loose" textAlign="center">
        <Flex flexDirection="column">
          {/* TODO: Implement warning with actual ledger integration */}
          {/* <WarningLabel mb="loose">Before proceeding, close Ledger Live if it’s open</WarningLabel> */}
          <Box mt="base">
            <img src={ConnectLedger} width="331px" />
          </Box>
        </Flex>
        <LedgerTitle mt="extra-loose" mx="50px" type={LedgerDrawerType.Connect} />
        <Box mb="base" mx="extra-loose">
          {warning}
        </Box>
        {isLookingForLedger ? (
          <LookingForLedger />
        ) : (
          <>
            <PrimaryButton
              height="40px"
              mb="loose"
              onClick={onConnectLedger}
              isLoading={awaitingLedgerConnection}
            >
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
