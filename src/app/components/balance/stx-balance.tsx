import { useMemo } from 'react';

import { Caption } from '@leather.io/ui';

import { stacksValue } from '@app/common/stacks-utils';
import { PrivateText } from '@app/components/privacy/private-text';
import { useStxAddressBalance } from '@app/query/stacks/balance/stx-balance.hooks';

interface StxBalanceProps {
  address: string;
}
export function StxBalance(props: StxBalanceProps) {
  const { address } = props;
  const { value: balance } = useStxAddressBalance(address);

  const stxBalance = useMemo(
    () =>
      stacksValue({
        value: balance?.stx.unlockedBalance.amount ?? 0,
        withTicker: true,
      }),
    [balance?.stx.unlockedBalance.amount]
  );

  return (
    <Caption>
      <PrivateText canClickToShow>{stxBalance}</PrivateText>
    </Caption>
  );
}
