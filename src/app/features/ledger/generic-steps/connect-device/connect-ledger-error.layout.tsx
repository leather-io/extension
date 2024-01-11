import { Box, Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { capitalize } from '@app/common/utils';
import { ErrorLabel } from '@app/components/error-label';
import { WarningLabel } from '@app/components/warning-label';
import { ConnectLedgerErr } from '@app/features/ledger/illustrations/ledger-illu-connect-ledger-error';
import { Button } from '@app/ui/components/button/button';
import { CircleIcon } from '@app/ui/components/icons/circle-icon';
import { Link } from '@app/ui/components/link/link';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';
import { useLedgerRequestKeysContext } from '../../generic-flows/request-keys/ledger-request-keys.context';

interface PossibleReasonUnableToConnectProps {
  text: string;
}
function PossibleReasonUnableToConnect(props: PossibleReasonUnableToConnectProps) {
  const { text } = props;

  return (
    <Flex alignItems="center">
      <Box mr="space.02">
        <CircleIcon fill="accent.text-primary" width="4px" />
      </Box>
      <styled.span textStyle="body.02">{text}</styled.span>
    </Flex>
  );
}

interface ConnectLedgerErrorLayoutProps {
  warningText: string | null;
  onCancelConnectLedger(): void;
  onTryAgain(): void;
}
export function ConnectLedgerErrorLayout(props: ConnectLedgerErrorLayoutProps) {
  const { warningText, onTryAgain } = props;
  const { chain } = useLedgerRequestKeysContext();

  return (
    <LedgerWrapper px="space.07">
      <Box mt="space.02">
        <ConnectLedgerErr />
      </Box>
      <LedgerTitle mt="space.07">We're unable to connect to your Ledger device</LedgerTitle>
      {warningText ? (
        <WarningLabel mt="space.04" px="space.06" fontSize="14px">
          {warningText}
        </WarningLabel>
      ) : (
        <ErrorLabel mt="space.02">Unable to connect</ErrorLabel>
      )}
      <Stack borderRadius="md" gap="space.01" textAlign="left" py="space.05">
        <PossibleReasonUnableToConnect text="Check if Ledger Live is open. Close it and try again" />
        <PossibleReasonUnableToConnect text="Ensure you only have one instance of Leather open" />
        <PossibleReasonUnableToConnect
          text={`Verify the ${capitalize(chain)} app is installed and open`}
        />
        <PossibleReasonUnableToConnect text="Check you've approved the browser USB pop up" />
      </Stack>
      <Button width="100%" onClick={onTryAgain}>
        Try again
      </Button>
      <HStack gap="space.01" mt="space.05">
        <styled.span color="accent.text-subdued" textStyle="label.03">
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
