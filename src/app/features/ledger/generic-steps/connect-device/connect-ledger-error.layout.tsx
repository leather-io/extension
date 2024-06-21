import { Box, Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { Button, Callout, CircleIcon, Link } from '@leather.io/ui';

import { ConnectLedgerErr } from '@app/features/ledger/illustrations/ledger-illu-connect-ledger-error';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

interface PossibleReasonUnableToConnectProps {
  text: string;
}
function PossibleReasonUnableToConnect(props: PossibleReasonUnableToConnectProps) {
  const { text } = props;

  return (
    <Flex alignItems="center">
      <Box mr="space.02">
        <CircleIcon fill="ink.text-primary" width="4px" />
      </Box>
      <styled.span textStyle="body.02">{text}</styled.span>
    </Flex>
  );
}

interface ConnectLedgerErrorLayoutProps {
  warningText: string | null;
  onTryAgain(): void;
  appName: string;
}
export function ConnectLedgerErrorLayout(props: ConnectLedgerErrorLayoutProps) {
  const { warningText, onTryAgain, appName } = props;

  return (
    <LedgerWrapper>
      <Box mt="space.02">
        <ConnectLedgerErr />
      </Box>
      <LedgerTitle mt={{ base: 'space.04', sm: 'space.07' }}>
        We're unable to connect to your Ledger device
      </LedgerTitle>

      <Callout variant={warningText ? 'warning' : 'error'} mt="space.04">
        {warningText ? warningText : 'Unable to connect'}
      </Callout>

      <Stack borderRadius="md" gap="space.01" textAlign="left" py="space.05">
        <PossibleReasonUnableToConnect text="Check if Ledger Live is open. Close it and try again" />
        <PossibleReasonUnableToConnect text="Ensure you only have one instance of Leather open" />
        <PossibleReasonUnableToConnect text={`Verify the ${appName} app is installed and open`} />
        <PossibleReasonUnableToConnect text="Check you've approved the browser USB pop up" />
      </Stack>
      <Button width="100%" onClick={onTryAgain}>
        Try again
      </Button>
      <HStack gap="space.01" mt="space.05">
        <styled.span color="ink.text-subdued" textStyle="label.03">
          If the problem persists, check our
        </styled.span>
        <Link
          href="https://leather.gitbook.io/guides/securing-the-wallet/using-ledger-with-leather"
          size="sm"
        >
          Support Page
        </Link>
      </HStack>
    </LedgerWrapper>
  );
}
