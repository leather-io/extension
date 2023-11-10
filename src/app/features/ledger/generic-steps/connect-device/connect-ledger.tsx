import { Suspense, lazy, useMemo } from 'react';

import { Box, HStack, Stack, styled } from 'leather-styles/jsx';

import { SupportedBlockchains } from '@shared/constants';
import { LEDGER_BITCOIN_ENABLED } from '@shared/environment';

import { ExternalLink } from '@app/components/external-link';
import { Divider } from '@app/components/layout/divider';
import { LeatherButton } from '@app/ui/components/button';
import { BtcLedgerIcon } from '@app/ui/components/icons/btc-ledger-icon';
import { StxLedgerIcon } from '@app/ui/components/icons/stx-ledger-icon';

import { LedgerWrapper } from '../../components/ledger-wrapper';

const PluggingInLedgerCableAnimation = lazy(
  () => import('../../animations/plugging-in-cable.lottie')
);

interface ConnectLedgerProps {
  chain?: SupportedBlockchains;
  awaitingLedgerConnection?: boolean;
  warning?: React.ReactNode;
  showInstructions?: boolean;
  onConnectLedger?(): void;
  connectBitcoin?(): void;
  connectStacks?(): void;
}

export function ConnectLedger(props: ConnectLedgerProps) {
  const {
    onConnectLedger,
    warning,
    showInstructions,
    awaitingLedgerConnection,
    connectBitcoin,
    connectStacks,
    chain,
  } = props;

  const showBitcoinConnectButton = useMemo(() => {
    if (!LEDGER_BITCOIN_ENABLED) {
      return false;
    }
    return chain === 'bitcoin' || !!connectBitcoin;
  }, [chain, connectBitcoin]);

  const showStacksConnectButton = useMemo(() => {
    return chain === 'stacks' || !!connectStacks;
  }, [chain, connectStacks]);

  const instructions = useMemo(
    () => [
      '1. Connect & unlock your Ledger',
      `2. Open${showBitcoinConnectButton ? ' Bitcoin or' : ''} Stacks app`,
      '3. Click the button below',
    ],
    [showBitcoinConnectButton]
  );

  return (
    <LedgerWrapper>
      <Box position="relative" width="100%" minHeight="120px">
        <Suspense fallback={null}>
          {<PluggingInLedgerCableAnimation position="absolute" top="-112px" />}
        </Suspense>
      </Box>

      <Stack gap="space.04" justifyItems="flex-start" textAlign="start" pb="space.06">
        <styled.span textStyle="heading.05">Please follow the instructions:</styled.span>

        <Stack gap="space.01" mb="space.02">
          {instructions.map((instruction, index) => (
            <styled.span textStyle="body.01" key={index}>
              {instruction}
            </styled.span>
          ))}
        </Stack>
        <HStack>
          {showBitcoinConnectButton && (
            <LeatherButton
              onClick={onConnectLedger || connectBitcoin}
              aria-busy={awaitingLedgerConnection}
              display="flex"
              alignItems="center"
            >
              <BtcLedgerIcon />
              <styled.span ml="space.01" textStyle="label.02">
                Connect Bitcoin
              </styled.span>
            </LeatherButton>
          )}
          {showStacksConnectButton && (
            <LeatherButton
              onClick={onConnectLedger || connectStacks}
              aria-busy={awaitingLedgerConnection}
              display="flex"
              alignItems="center"
            >
              <StxLedgerIcon />
              <styled.span ml="space.01" textStyle="label.02">
                Connect Stacks
              </styled.span>
            </LeatherButton>
          )}
        </HStack>
      </Stack>
      {warning && (
        <Box mb="base" mx="extra-loose">
          {warning}
        </Box>
      )}
      {showInstructions ? (
        <Stack gap="space.05" width="100%">
          <Divider />
          <Stack gap="space.01">
            <styled.span textStyle="label.03" color="accent.text-subdued">
              First time using Ledger on Leather?
            </styled.span>
            <ExternalLink href="https://www.hiro.so/wallet-faq/how-can-i-use-my-ledger-device-with-hiro-wallet">
              <styled.span textStyle="label.03" textDecoration="underline">
                Learn how to use Ledger device with Leather ↗
              </styled.span>
            </ExternalLink>
          </Stack>
        </Stack>
      ) : null}
    </LedgerWrapper>
  );
}
