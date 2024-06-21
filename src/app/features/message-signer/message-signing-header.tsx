import { Stack, styled } from 'leather-styles/jsx';

import { Flag } from '@leather.io/ui';

import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Favicon } from '@app/components/favicon';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

interface MessageSigningHeaderProps {
  name?: string;
  origin: string | null;
  additionalText?: string;
}
export function MessageSigningHeader({
  name,
  origin,
  additionalText = '',
}: MessageSigningHeaderProps) {
  const { chain, isTestnet } = useCurrentNetworkState();

  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition = isTestnet
    ? ` using ${getUrlHostname(chain.stacks.url)}${addPortSuffix(chain.stacks.url)}`
    : '';

  const displayName = name ?? origin;

  const caption = displayName
    ? `Requested by ${displayName}${originAddition}${testnetAddition}`
    : null;

  return (
    <Stack gap="space.04" pt="space.05">
      <styled.h1 textStyle="heading.03">Sign message</styled.h1>
      {caption && (
        <Flag img={<Favicon origin={origin ?? ''} />} pl="space.02">
          <styled.span textStyle="label.02" wordBreak="break-word">
            {caption}
            {additionalText}
          </styled.span>
        </Flag>
      )}
    </Stack>
  );
}
