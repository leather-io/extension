import { useMemo } from 'react';

import { stacksValue } from '@app/common/stacks-utils';
import { Caption } from '@app/components/typography';
import { useAddressAvailableStxBalance } from '@app/query/balance/balance.hooks';

interface BalanceProps {
  address: string;
}
export function Balance(props: BalanceProps): JSX.Element | null {
  const { address } = props;
  const availableStxBalance = useAddressAvailableStxBalance(address);

  const balance = useMemo(
    () =>
      stacksValue({
        value: availableStxBalance || 0,
        withTicker: true,
      }),
    [availableStxBalance]
  );

  return <Caption>{balance}</Caption>;
}
