import { memo } from 'react';

import { Stack } from '@stacks/ui';

import { isSignedMessageType } from '@shared/signature/signature-types';

import { getSignaturePayloadFromToken } from '@app/common/signature/requests';
import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

function PageTopBase() {
  const { chain, isTestnet } = useCurrentNetworkState();
  const { origin, requestToken, messageType } = useSignatureRequestSearchParams();
  if (!requestToken) return null;
  if (!isSignedMessageType(messageType)) return null;
  const signatureRequest = getSignaturePayloadFromToken(requestToken);
  if (!signatureRequest) return null;

  const appName = signatureRequest?.appDetails?.name;
  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition = isTestnet
    ? ` using ${getUrlHostname(chain.stacks.url)}${addPortSuffix(chain.stacks.url)}`
    : '';
  const caption = appName ? `Requested by "${appName}"${originAddition}${testnetAddition}` : null;

  return (
    <Stack pt="extra-loose" spacing="base">
      <Title fontWeight="bold" as="h1">
        Sign Message
      </Title>
      {caption && <Caption wordBreak="break-word">{caption}</Caption>}
    </Stack>
  );
}

export const PageTop = memo(PageTopBase);
