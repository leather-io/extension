import { styled } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import type { Src20Token } from '@app/query/bitcoin/stamps/stamps-by-address.query';
import { Src20AvatarIcon } from '@app/ui/components/avatar/src20-avatar-icon';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Pressable } from '@app/ui/pressable/pressable';

interface Src20TokenAssetItemLayoutProps {
  token: Src20Token;
}
export function Src20TokenAssetItemLayout({ token }: Src20TokenAssetItemLayoutProps) {
  const balance = createMoney(Number(token.amt), token.tick, 0).amount.toString();
  const formattedBalance = formatBalance(balance);

  return (
    <Pressable my="space.02">
      <ItemLayout
        flagImg={<Src20AvatarIcon />}
        titleLeft={token.tick.toUpperCase()}
        captionLeft="SRC-20"
        titleRight={
          <BasicTooltip
            asChild
            label={formattedBalance.isAbbreviated ? balance : undefined}
            side="left"
          >
            <styled.span data-testid={token.tick} fontWeight={500} textStyle="label.02">
              {formattedBalance.value}
            </styled.span>
          </BasicTooltip>
        }
      />
    </Pressable>
  );
}
