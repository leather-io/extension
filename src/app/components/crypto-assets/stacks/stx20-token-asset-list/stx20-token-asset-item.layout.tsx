import { styled } from 'leather-styles/jsx';

import type { Stx20Token } from '@app/api/stacks/types/stx20-types';
import { formatBalance } from '@app/common/format-balance';
import { Avatar } from '@app/ui/components/avatar/avatar';
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
        flagImg={
          // TODO: Replace, need avatar for STX-20
          <Avatar.Root>
            <Avatar.Image alt="STX20" src="" />
            <Avatar.Fallback>STX20</Avatar.Fallback>
          </Avatar.Root>
        }
        titleLeft={token.ticker}
        captionLeft="STX-20"
        titleRight={
          <BasicTooltip
            asChild
            label={formattedBalance.isAbbreviated ? balanceAsString : undefined}
            side="left"
          >
            <styled.span data-testid={token.ticker} fontWeight={500} textStyle="label.02">
              {formattedBalance.value}
            </styled.span>
          </BasicTooltip>
        }
      />
    </Pressable>
  );
}
