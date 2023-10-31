import { useMemo } from 'react';

import { stacksValue } from '@app/common/stacks-utils';
import { useAnchoredStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { Caption } from '@app/ui/components/typography/caption';

interface BalanceProps {
  address: string;
}
export function StxBalance(props: BalanceProps) {
  const { address } = props;
  const { data: balances } = useAnchoredStacksAccountBalances(address);

  const balance = useMemo(
    () =>
      stacksValue({
        value: balances?.stx?.unlockedStx.amount ?? 0,
        withTicker: true,
      }),
    [balances]
  );

  return <Caption>{balance}</Caption>;
}
