import { memo } from 'react';

import { Flex } from '@stacks/ui';

import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import { Flag } from '@app/components/layout/flag';
import { Caption, Title } from '@app/components/typography';
import { usePsbtRequestSearchParams } from '@app/store/psbts/requests.hooks';

function PsbtRequestHeaderBase() {
  const { origin, requestToken } = usePsbtRequestSearchParams();

  if (!requestToken) return null;

  const psbtRequest = getPsbtPayloadFromToken(requestToken);

  const appIcon = psbtRequest.appDetails?.icon;
  const caption = `${origin} is requesting you sign this PSBT`;

  return (
    <Flex flexDirection="column" my="loose" width="100%">
      <Title fontSize={3} fontWeight={500} mb="base">
        Sign transaction
      </Title>
      {caption && (
        <Flag align="middle" img={<img src={appIcon} height="16px" width="16px" />} pl="tight">
          <Caption wordBreak="break-word">{caption}</Caption>
        </Flag>
      )}
    </Flex>
  );
}

export const PsbtRequestHeader = memo(PsbtRequestHeaderBase);
