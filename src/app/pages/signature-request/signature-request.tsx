import { Box, color, Stack } from '@stacks/ui';
import { memo } from 'react';

import { useRouteHeader } from '@app/common/hooks/use-route-header';

import {
  getSignaturePayloadFromToken,
  getStructuredDataPayloadFromToken,
} from '@app/common/signature/requests';
import { isUndefined } from '@app/common/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Link } from '@app/components/link';
import { Caption } from '@app/components/typography';
import { PopupHeader } from '@app/features/current-account/popup-header';
import {
  useIsSignatureRequestValid,
  useSignatureRequestSearchParams,
} from '@app/store/signatures/requests.hooks';
import {
  isSignatureMessageType,
  isStructuredMessage,
  SignatureMessageType,
} from '@shared/signature/types';
import { FiAlertTriangle } from 'react-icons/fi';
import { MessageBox } from './components/message-box';
import { NetworkRow } from './components/network-row';
import { PageTop } from './components/page-top';
import { SignAction } from './components/sign-action';
import { StructuredDataBox } from './components/structured-data-box';
import { ChainID } from '@stacks/common';

function SignatureRequestBase(): JSX.Element | null {
  const validSignatureRequest = useIsSignatureRequestValid();
  const { requestToken, messageType } = useSignatureRequestSearchParams();

  useRouteHeader(<PopupHeader />);

  if (!isSignatureMessageType(messageType)) return null;
  if (isUndefined(validSignatureRequest)) return null;
  if (!requestToken || !messageType) return null;

  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      <PageTop />
      {!validSignatureRequest ? (
        <ErrorMessage errorMessage={'Invalid signature request'} />
      ) : isStructuredMessage(messageType) ? (
        <SignatureRequestStructuredDataContent
          requestToken={requestToken}
          messageType={messageType}
        />
      ) : (
        <SignatureRequestMessageContent requestToken={requestToken} messageType={messageType} />
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

function SignatureRequestMessageContent(props: {
  requestToken: string;
  messageType: SignatureMessageType;
}) {
  const { requestToken, messageType } = props;
  const signatureRequest = getSignaturePayloadFromToken(requestToken);
  const { message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <MessageBox message={message} />
      <NetworkRow chainId={network?.chainId || ChainID.Testnet} />
      <SignAction message={message} messageType={messageType} />
      <hr />
      <Disclaimer appName={appName} />
    </>
  );
}

function SignatureRequestStructuredDataContent(props: {
  requestToken: string;
  messageType: SignatureMessageType;
}) {
  const { requestToken, messageType } = props;
  const signatureRequest = getStructuredDataPayloadFromToken(requestToken);
  const { domain, message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <StructuredDataBox message={message} domain={domain} />
      <NetworkRow chainId={network?.chainId || ChainID.Testnet} />
      <SignAction message={message} messageType={messageType} domain={domain} />
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
