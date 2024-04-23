import { Stack, styled } from 'leather-styles/jsx';

import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Favicon } from '@app/components/favicon';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { Flag } from '@app/ui/components/flag/flag';

interface MessageSigningHeaderProps {
  name?: string;
  origin: string | null;
  additionalText?: string;
}
export function MessageSigningHeader({
  name,
  origin,
}: MessageSigningHeaderProps) {
  const { chain, isTestnet } = useCurrentNetworkState();

  const displayName = origin ? `${getUrlHostname(origin)}` : '';

  const caption = displayName
    ? `Requested by ${displayName}`
    : null;

  return (
    <Stack gap="space.04" pt="space.05">
      <styled.h1 textStyle="heading.03">Sign message</styled.h1>
      {caption && (
        <Flag img={<Favicon origin={origin ?? ''} />} pl="space.02">
          <styled.span textStyle="label.02" wordBreak="break-word">
            {caption}
          </styled.span>
        </Flag>
      )}
    </Stack>
  );
}
