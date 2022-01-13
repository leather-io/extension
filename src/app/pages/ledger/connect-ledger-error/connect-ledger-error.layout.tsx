import { FiCircle } from 'react-icons/fi';
import { Box, color, Flex, Stack } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer';
import { Caption } from '@app/components/typography';
import ConnectLedgerError from '@assets/images/onboarding/ledger/connect-ledger-error.png';
import { ErrorLabel } from '@app/components/error-label';
import { PrimaryButton } from '@app/components/primary-button';
import { Link } from '@app/components/link';

import { ConnectLedgerTitle } from '../components/connect-ledger-title';

interface PossibleReasonUnableToConnectProps {
  text: string;
}
function PossibleReasonUnableToConnect(props: PossibleReasonUnableToConnectProps) {
  const { text } = props;

  return (
    <Flex>
      <Box mr="tight" mt="3px">
        <FiCircle fill={color('text-caption')} size="4px" />
      </Box>
      <Caption>{text}</Caption>
    </Flex>
  );
}

interface ConnectLedgerErrorLayoutProps {
  onCancelConnectLedger(): void;
  onTryAgain(): void;
}
export function ConnectLedgerErrorLayout(props: ConnectLedgerErrorLayoutProps) {
  const { onCancelConnectLedger, onTryAgain } = props;

  return (
    <BaseDrawer title={<Box />} isShowing onClose={onCancelConnectLedger}>
      {/* <Stack alignItems="center" pb="loose" px="loose" spacing="loose" textAlign="center"> */}
      <Flex alignItems="center" flexDirection="column" pb="loose" textAlign="center">
        <Box mt="tight">
          <img src={ConnectLedgerError} width="247px" />
        </Box>
        <ConnectLedgerTitle />
        <ErrorLabel fontSize={1} lineHeight={1.4} mt="tight">
          Unable to connect
        </ErrorLabel>
        <Stack
          border="2px solid"
          borderColor={color('border')}
          borderRadius="12px"
          my="loose"
          mx="extra-loose"
          spacing="base"
          textAlign="left"
          p="extra-loose"
        >
          <PossibleReasonUnableToConnect text="Check if Ledger Live is open. If it is, close it and try again" />
          <PossibleReasonUnableToConnect text="Verify the Stacks app is installed" />
          <PossibleReasonUnableToConnect text="If installed, verify you’re not on another app" />
          <PossibleReasonUnableToConnect text="Verify the screen is unlocked" />
          <PossibleReasonUnableToConnect text="Verify you chose the correct address to connect" />
        </Stack>
        <PrimaryButton height="40px" onClick={onTryAgain}>
          Try again
        </PrimaryButton>
        {/* TODO: Add support page route link here */}
        <Caption mt="loose">
          If the problem persists, check our{' '}
          <Link display="inline" fontSize={1} onClick={() => {}}>
            Support Page
          </Link>
        </Caption>
      </Flex>
    </BaseDrawer>
  );
}
