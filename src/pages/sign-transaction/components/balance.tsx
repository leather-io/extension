import React from 'react';

import { stacksValue } from '@common/stacks-utils';
import { Caption } from '@components/typography';
import { useCurrentAccountInfo } from '@store/accounts/account.hooks';

export function Balance(): JSX.Element | null {
  const info = useCurrentAccountInfo();

  return info?.balance ? (
    <Caption>
      {stacksValue({
        value: info.balance.toString(),
        withTicker: true,
      })}
    </Caption>
  ) : null;
}
