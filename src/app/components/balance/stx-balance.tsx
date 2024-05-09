import { useMemo } from 'react';

import { stacksValue } from '@app/common/stacks-utils';
import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/stx-balance.hooks';
import { Caption } from '@app/ui/components/typography/caption';

interface StxBalanceProps {
  address: string;
}
export function StxBalance(props: StxBalanceProps) {
  const { address } = props;
  const { data: balance } = useStxCryptoAssetBalance(address);

  const stxBalance = useMemo(
    () =>
      stacksValue({
        value: balance?.unlockedBalance.amount ?? 0,
        withTicker: true,
      }),
    [balance]
  );

  return <Caption>{stxBalance}</Caption>;
}
