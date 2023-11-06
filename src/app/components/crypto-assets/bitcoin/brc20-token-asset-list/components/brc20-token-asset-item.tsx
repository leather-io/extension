import { createMoney } from '@shared/models/money.model';

import { forwardRefWithAs } from '@app/common/utils/stacks-ui/core/forwardRefWithAs';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

import { Brc20TokenAssetItemLayout } from './brc20-token-asset-item.layout';

interface Brc20TokenAssetItemProps {
  token: Brc20Token;
  isPressable?: boolean;
  onClick?: () => void;
}
export const Brc20TokenAssetItem = forwardRefWithAs(
  ({ token, isPressable, onClick }: Brc20TokenAssetItemProps, ref) => {
    return (
      <Brc20TokenAssetItemLayout
        balance={createMoney(Number(token.overall_balance), token.tick, 0)}
        caption="BRC-20"
        ref={ref}
        title={token.tick}
        isPressable={isPressable}
        onClick={onClick} // #4383 TODO - check this works
      />
    );
  }
);
