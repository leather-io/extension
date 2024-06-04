import { useMemo } from 'react';

import { useStxCryptoAssetBalance } from '@leather-wallet/query';
import { Caption } from '@leather-wallet/ui';

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
