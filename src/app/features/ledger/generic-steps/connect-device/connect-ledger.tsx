import { Suspense, lazy, useMemo } from 'react';

import { Box, HStack, Stack, styled } from 'leather-styles/jsx';

import type { SupportedBlockchains } from '@leather.io/models';
import { BitcoinIcon, Button, Link, StacksIcon } from '@leather.io/ui';

import { Divider } from '@app/components/layout/divider';

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
    return chain === 'bitcoin' || !!connectBitcoin;
  }, [chain, connectBitcoin]);

  const showStacksConnectButton = useMemo(() => {
    return chain === 'stacks' || !!connectStacks;
  }, [chain, connectStacks]);

  const instructions = useMemo(() => {
    const showBothBtns = showBitcoinConnectButton && showStacksConnectButton;
    return [
      '1. Connect & unlock your Ledger',
      `2. Open${showBitcoinConnectButton ? ' Bitcoin' : ''} ${showBothBtns ? 'or' : ''} ${
        showStacksConnectButton ? 'Stacks' : ''
      } app`,
      '3. Click the button below',
    ];
  }, [showBitcoinConnectButton, showStacksConnectButton]);

  return (
    <LedgerWrapper>
      <Box position="relative" width="100%" minHeight="220px">
        <Suspense fallback={null}>
          {<PluggingInLedgerCableAnimation position="absolute" top="-20px" />}
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
            <Button
              onClick={onConnectLedger || connectBitcoin}
              aria-busy={awaitingLedgerConnection}
            >
              <HStack gap="space.01">
                <BitcoinIcon color="ink.background-primary" />
                <styled.span textStyle="label.02">Connect Bitcoin</styled.span>
              </HStack>
            </Button>
          )}
          {showStacksConnectButton && (
            <Button
              onClick={onConnectLedger || connectStacks}
              aria-busy={awaitingLedgerConnection}
              display="flex"
              alignItems="center"
            >
              <HStack gap="space.01">
                <StacksIcon color="ink.background-primary" />
                <styled.span textStyle="label.02">Connect Stacks</styled.span>
              </HStack>
            </Button>
          )}
        </HStack>
      </Stack>
      {warning && (
        <Box mb="space.04" mx="space.06">
          {warning}
        </Box>
      )}
      {showInstructions ? (
        <Stack gap="space.05" width="100%">
          <Divider />
          <Stack alignItems="center" gap="space.01">
            <styled.span textStyle="label.03" color="ink.text-subdued">
              First time using Ledger on Leather?
            </styled.span>
            <Link
              href="https://www.hiro.so/wallet-faq/how-can-i-use-my-ledger-device-with-hiro-wallet"
              size="sm"
            >
              Learn how to use Ledger device with Leather ↗
            </Link>
          </Stack>
        </Stack>
      ) : null}
    </LedgerWrapper>
  );
}
