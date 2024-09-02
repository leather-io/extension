import { useMemo } from 'react';

import { useStxCryptoAssetBalance } from '@leather.io/query';
import { Caption } from '@leather.io/ui';

import { stacksValue } from '@app/common/stacks-utils';
import { PrivateText } from '@app/components/privacy/private-text';

interface StxBalanceProps {
  address: string;
}
export function StxBalance(props: StxBalanceProps) {
  const { address } = props;
  const { filteredBalanceQuery } = useStxCryptoAssetBalance(address);

  const stxBalance = useMemo(
    () =>
      stacksValue({
        value: filteredBalanceQuery.data?.unlockedBalance.amount ?? 0,
        withTicker: true,
      }),
    [filteredBalanceQuery.data?.unlockedBalance.amount]
  );

  return (
    <Caption>
      <PrivateText canClickToShow>{stxBalance}</PrivateText>
    </Caption>
  );
}
