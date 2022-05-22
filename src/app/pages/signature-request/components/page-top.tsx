import { memo } from 'react';
import { Stack } from '@stacks/ui';

import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';
import { getPayloadFromToken } from '@app/common/signature/requests';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

function PageTopBase(): JSX.Element | null {
  const network = useCurrentNetwork();
  const { origin, requestToken } = useSignatureRequestSearchParams();
  if (!requestToken) return null;
  const signatureRequest = getPayloadFromToken(requestToken);
  if (!signatureRequest) return null;

  const appName = signatureRequest?.appDetails?.name;
  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition = network.isTestnet
    ? ` using ${getUrlHostname(network.url)}${addPortSuffix(network.url)}`
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
