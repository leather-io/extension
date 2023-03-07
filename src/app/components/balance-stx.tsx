import { useMemo } from 'react';

import { stacksValue } from '@app/common/stacks-utils';
import { Caption } from '@app/components/typography';
import { useAnchoredStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';

interface BalanceProps {
  address: string;
}
export function StxBalance(props: BalanceProps) {
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

  return <Caption variant="c3">{balance}</Caption>;
}
