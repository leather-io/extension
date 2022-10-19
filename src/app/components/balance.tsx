import { useMemo } from 'react';

import { stacksValue } from '@app/common/stacks-utils';
import { Caption } from '@app/components/typography';
import { useAddressBalances } from '@app/query/stacks/balance/balance.hooks';

interface BalanceProps {
  address: string;
}
export function Balance(props: BalanceProps): JSX.Element | null {
  const { address } = props;
  const { data: balances } = useAddressBalances(address);

  const balance = useMemo(
    () =>
      stacksValue({
        value: balances?.availableStx.amount ?? 0,
        withTicker: true,
      }),
    [balances]
  );

  return <Caption>{balance}</Caption>;
}
