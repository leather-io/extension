import { createMoney } from '@shared/models/money.model';

import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

import { Brc20TokenAssetItemLayout } from './brc20-token-asset-item.layout';

interface Brc20TokenAssetItemProps {
  token: Brc20Token;
  isPressable?: boolean;
  onClick?(): void;
  displayNotEnoughBalance?: boolean;
}
export function Brc20TokenAssetItem({
  token,
  isPressable,
  onClick,
  displayNotEnoughBalance,
}: Brc20TokenAssetItemProps) {
  return (
    <Brc20TokenAssetItemLayout
      balance={createMoney(Number(token.overall_balance), token.tick, 0)}
      caption="BRC-20"
      title={token.tick}
      isPressable={isPressable}
      onClick={onClick}
      displayNotEnoughBalance={displayNotEnoughBalance}
    />
  );
}
