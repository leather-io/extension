import { Stack } from '@stacks/ui';
import { memo } from 'react';

import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { ChainID } from '@stacks/transactions';
import { useProfileUpdateRequestSearchParams } from '@app/store/profiles/requests.hooks';
import { getProfileDataContentFromToken } from '@app/common/profiles/requests';

function PageTopBase() {
  const network = useCurrentNetwork();
  const { origin, requestToken } = useProfileUpdateRequestSearchParams();
  if (!requestToken) return null;
  const profileUpdaterPayload = getProfileDataContentFromToken(requestToken);
  if (!profileUpdaterPayload) return null;

  const appName = profileUpdaterPayload?.appDetails?.name;
  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition =
    network.chainId === ChainID.Testnet
      ? ` using ${getUrlHostname(network.url)}${addPortSuffix(network.url)}`
      : '';
  const caption = appName
    ? `Requested by "${appName}"${originAddition}${testnetAddition}`
    : 'Request by an unknown app';
  const avatarUrl = profileUpdaterPayload?.profile?.image?.[0]?.contentUrl;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Stack pt="extra-loose" spacing="base">
        <Title fontWeight="bold" as="h1">
          Update Profile
        </Title>
        {caption && <Caption wordBreak="break-word">{caption}</Caption>}
      </Stack>
      {avatarUrl && (
        <img
          style={{
            borderRadius: '100%',
            width: '50px',
            height: '50px',
            alignItems: 'center',
            marginTop: '32px',
          }}
          src={avatarUrl}
        />
      )}
    </div>
  );
}

export const PageTop = memo(PageTopBase);
