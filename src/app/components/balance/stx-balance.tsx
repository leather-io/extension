import { useMemo } from 'react';

import { useStxCryptoAssetBalance } from '@leather.io/query';
import { Caption } from '@leather.io/ui';

import { stacksValue } from '@app/common/stacks-utils';

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
