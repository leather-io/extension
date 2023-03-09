import { memo } from 'react';

import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { Caption, Title } from '@app/components/typography';
import { usePsbtRequestSearchParams } from '@app/store/psbts/requests.hooks';

function PsbtRequestHeaderBase() {
  const { origin, requestToken } = usePsbtRequestSearchParams();

  if (!requestToken) return null;

  const psbtRequest = getPsbtPayloadFromToken(requestToken);

  if (!psbtRequest) return null;

  const appName = psbtRequest?.appDetails?.name;
  const caption = appName ? `Requested by ${appName} (${origin})` : null;

  return (
    <>
      <Flag align="middle" img={<BtcIcon />} mt="loose" spacing="base" width="100%">
        <Title fontSize={3} fontWeight={500} mb="tight">
          Sign PSBT
        </Title>
        <Caption>(Partially Signed Bitcoin Transaction)</Caption>
      </Flag>
      {caption && <Caption wordBreak="break-word">{caption}</Caption>}
    </>
  );
}

export const PsbtRequestHeader = memo(PsbtRequestHeaderBase);
