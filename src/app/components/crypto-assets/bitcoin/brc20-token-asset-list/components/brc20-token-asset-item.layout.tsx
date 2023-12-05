import { styled } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';
import { Brc20AvatarIcon } from '@app/ui/components/avatar/brc20-avatar-icon';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Pressable } from '@app/ui/pressable/pressable';

interface Brc20TokenAssetItemLayoutProps {
  token: Brc20Token;
  onClick?(): void;
}
export function Brc20TokenAssetItemLayout({
  onClick,

  token,
}: Brc20TokenAssetItemLayoutProps) {
  const balance = createMoney(Number(token.overall_balance), token.ticker, 0);
  const formattedBalance = formatBalance(balance.amount.toString());

  return (
    <Pressable onClick={onClick} my="space.02">
      <ItemLayout
        flagImg={<Brc20AvatarIcon />}
        titleLeft={token.ticker}
        captionLeft="BRC-20"
        titleRight={
          <BasicTooltip
            asChild
            label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
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
