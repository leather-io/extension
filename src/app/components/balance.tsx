import { useMemo } from 'react';

import { stacksValue } from '@app/common/stacks-utils';
import { Caption } from '@app/components/typography';
import { useAnchoredStacksAccountBalances } from '@app/query/stacks/balance/balance.hooks';

interface BalanceProps {
  address: string;
}
export function Balance(props: BalanceProps) {
  const { address } = props;
  const { data: balances } = useAnchoredStacksAccountBalances(address);

  const balance = useMemo(
    () =>
      stacksValue({
        value: balances?.stx?.availableStx.amount ?? 0,
        withTicker: true,
      }),
    [balances]
  );

  return <Caption>{balance}</Caption>;
}
