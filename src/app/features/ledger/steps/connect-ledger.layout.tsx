import { Box } from '@stacks/ui';

import { Divider } from '@app/components/divider';

import { PrimaryButton } from '@app/components/primary-button';
import { Caption } from '@app/components/typography';

import { LedgerConnectInstructionTitle } from '../components/ledger-title';
import { ExternalLink } from '@app/components/external-link';
// import ConnectLedger from '@assets/images/ledger/connect-ledger.png';
import { lazy, Suspense } from 'react';
import { LedgerWrapper } from '../components/ledger-wrapper';

const PluggingInLedgerCableAnimation = lazy(() => import('../animations/plugging-in-cable.lottie'));

interface ConnectLedgerLayoutProps {
  isLookingForLedger: boolean;
  awaitingLedgerConnection: boolean;
  warning: React.ReactNode;
  showInstructions: boolean;
  onConnectLedger(): void;
}
export function ConnectLedgerLayout(props: ConnectLedgerLayoutProps) {
  const { onConnectLedger, warning, showInstructions, awaitingLedgerConnection } = props;

  return (
    <LedgerWrapper>
      <Box position="relative" width="100%" minHeight="120px">
        <Suspense fallback={null}>
          <PluggingInLedgerCableAnimation position="absolute" top="-80px" />
        </Suspense>
      </Box>
      {/* <img src={ConnectLedger} width="299" height="97" /> */}
      <LedgerConnectInstructionTitle mt="extra-loose" mx="50px" />
      <PrimaryButton
        height="40px"
        my="base"
        onClick={onConnectLedger}
        isLoading={awaitingLedgerConnection}
      >
        Connect
      </PrimaryButton>
      <Box mb="base" mx="extra-loose">
        {warning}
      </Box>
      {showInstructions ? (
        <Box width="100%">
          <Divider />
          <Caption mb="tight" mt="loose">
            First time using Ledger on Hiro Wallet?
          </Caption>
          <ExternalLink
            href="https://www.hiro.so/wallet-faq/how-can-i-use-my-ledger-device-with-hiro-wallet"
            fontSize={1}
          >
            See how to download the Stacks app
          </ExternalLink>
        </Box>
      ) : null}
    </LedgerWrapper>
  );
}
