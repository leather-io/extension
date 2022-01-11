import React from 'react';

import { useWallet } from '@common/hooks/use-wallet';
import { Body } from '@components/typography';
import { Card } from '@components/card';

export function SecretKeyCard(): JSX.Element {
  const { secretKey } = useWallet();

  return (
    <Card title="Your Secret Key">
      <Body data-testid="textarea-seed-phrase" data-loaded={String(!!secretKey)}>
        {secretKey}
      </Body>
    </Card>
  );
}
