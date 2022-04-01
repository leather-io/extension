import { memo } from 'react';
import { Box, color, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';

import {
  useIsSignatureRequestValid,
  useSignatureRequestSearchParams,
} from '@app/store/signatures/requests.hooks';
import { PageTop } from './components/page-top';
import { MessageBox } from './components/message-box';
import { NetworkRow } from './components/network-row';
import { SignAction } from './components/sign-action';
import { StacksNetwork, StacksTestnet } from '@stacks/network';
import { FiAlertTriangle } from 'react-icons/fi';
import { Caption } from '@app/components/typography';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { getPayloadFromToken } from '@app/common/signature/requests';
import { isUndefined } from '@app/common/utils';
import { Link } from '@app/components/link';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';

function SignatureRequestBase(): JSX.Element | null {
  const validSignatureRequest = useIsSignatureRequestValid();
  const { requestToken } = useSignatureRequestSearchParams();
  useRouteHeader(<PopupHeader />);

  if (!requestToken) return null;
  const signatureRequest = getPayloadFromToken(requestToken);
  if (!signatureRequest) return null;
  if (isUndefined(validSignatureRequest)) return null;
  const appName = signatureRequest?.appDetails?.name;
  const { message, network } = signatureRequest;

  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      <PageTop />
      {!validSignatureRequest ? (
        <ErrorMessage errorMessage={'Invalid signature request'} />
      ) : (
        <SignatureRequestContent
          message={message}
          network={network || new StacksTestnet()}
          appName={appName}
        />
      )}
    </Stack>
  );
}

interface DisclaimerProps {
  appName: string | undefined;
}

function Disclaimer(props: DisclaimerProps) {
  const { appName } = props;
  return (
    <Box>
      <Caption>
        By signing this message, you are authorizing {appName || 'the app'} to do something specific
        on your behalf. Only sign messages that you understand from apps that you trust.
        <Link
          display={'inline'}
          fontSize="14px"
          onClick={() => openInNewTab('https://docs.hiro.so/build-apps/message-signing')}
        >
          {' '}
          Learn more
        </Link>
        .
      </Caption>
    </Box>
  );
}

interface SignatureRequestContentProps {
  network: StacksNetwork;
  message: string;
  appName: string | undefined;
}

function SignatureRequestContent(props: SignatureRequestContentProps) {
  const { message, network, appName } = props;
  return (
    <>
      <MessageBox message={message} />
      <NetworkRow network={network} />
      <SignAction message={message} />
      <hr />
      <Disclaimer appName={appName} />
    </>
  );
}

export const SignatureRequest = memo(SignatureRequestBase);

interface ErrorMessageProps {
  errorMessage: string;
}

function ErrorMessage(props: ErrorMessageProps): JSX.Element | null {
  const { errorMessage } = props;
  if (!errorMessage) return null;

  return (
    <Stack alignItems="center" bg="#FCEEED" p="base" borderRadius="12px" isInline>
      <Box color={color('feedback-error')} strokeWidth={2} as={FiAlertTriangle} />
      <Caption color={color('feedback-error')}>{errorMessage}</Caption>
    </Stack>
  );
}
