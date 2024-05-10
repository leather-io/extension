import { styled } from 'leather-styles/jsx';

import { formatBalance } from '@app/common/format-balance';
import type { Stx20Token } from '@app/query/stacks/stacks-client';
import { Stx20AvatarIcon } from '@app/ui/components/avatar/stx20-avatar-icon';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Pressable } from '@app/ui/pressable/pressable';

interface Stx20TokenAssetItemLayoutProps {
  token: Stx20Token;
}
export function Stx20TokenAssetItemLayout({ token }: Stx20TokenAssetItemLayoutProps) {
  const balanceAsString = token.balance.amount.toString();
  const formattedBalance = formatBalance(balanceAsString);

  return (
    <Pressable my="space.02">
      <ItemLayout
        flagImg={<Stx20AvatarIcon />}
        titleLeft={token.tokenData.ticker}
        captionLeft="STX-20"
        titleRight={
          <BasicTooltip
            asChild
            label={formattedBalance.isAbbreviated ? balanceAsString : undefined}
            side="left"
          >
            <styled.span data-testid={token.tokenData.ticker} fontWeight={500} textStyle="label.02">
              {formattedBalance.value}
            </styled.span>
          </BasicTooltip>
        }
      />
    </Pressable>
  );
}
