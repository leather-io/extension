import { Suspense, lazy } from 'react';

import { Box } from 'leather-styles/jsx';
import { Divider } from 'leather-styles/jsx';

import { SupportedBlockchains } from '@shared/constants';

import { LeatherButton } from '@app/components/button/button';
import { ExternalLink } from '@app/components/external-link';
import { Capitalize } from '@app/components/text/capitalize';
import { Caption } from '@app/components/typography';

import { LedgerConnectInstructionTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

const PluggingInLedgerCableAnimation = lazy(
  () => import('../../animations/plugging-in-cable.lottie')
);

interface ConnectLedgerLayoutProps {
  chain: SupportedBlockchains;
  awaitingLedgerConnection: boolean;
  warning: React.ReactNode;
  showInstructions: boolean;
  onConnectLedger(): void;
}
export function ConnectLedgerLayout(props: ConnectLedgerLayoutProps) {
  const { chain, onConnectLedger, warning, showInstructions, awaitingLedgerConnection } = props;

  return (
    <LedgerWrapper>
      <Box position="relative" width="100%" minHeight="120px">
        <Suspense fallback={null}>
          <PluggingInLedgerCableAnimation position="absolute" top="-80px" />
        </Suspense>
      </Box>
      <LedgerConnectInstructionTitle chain={chain} mt="space.06" mx="50px" />
      <LeatherButton my="space.04" onClick={onConnectLedger} aria-busy={awaitingLedgerConnection}>
        Connect
      </LeatherButton>
      <Box mb="space.04" mx="space.06">
        {warning}
      </Box>
      {showInstructions ? (
        <Box width="100%">
          <Divider />
          <Caption mb="space.02" mt="space.05">
            First time using Ledger on Leather?
          </Caption>
          <ExternalLink
            href="https://www.hiro.so/wallet-faq/how-can-i-use-my-ledger-device-with-hiro-wallet"
            // #4164 FIXME migrate - check this text size
            // fontSize={1}
          >
            See how to download the <Capitalize>{chain}</Capitalize> app
          </ExternalLink>
        </Box>
      ) : null}
    </LedgerWrapper>
  );
}
