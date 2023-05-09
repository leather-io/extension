import { Stack } from '@stacks/ui';

import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';
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
    <Stack pt="extra-loose" spacing="base">
      <Title fontWeight="bold" as="h1">
        Sign Message
      </Title>
      {caption && (
        <Caption wordBreak="break-word" lineHeight={1.5}>
          {caption}
          {additionalText}
        </Caption>
      )}
    </Stack>
  );
}
