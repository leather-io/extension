import BigNumber from 'bignumber.js';
import { styled } from 'leather-styles/jsx';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { formatBalance } from '@app/common/format-balance';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';
import { Brc20AvatarIcon } from '@app/ui/components/avatar/brc20-avatar-icon';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Pressable } from '@app/ui/pressable/pressable';

interface Brc20TokenAssetItemLayoutProps {
  token: Brc20Token;
  onClick?(): void;
}
export function Brc20TokenAssetItemLayout({ onClick, token }: Brc20TokenAssetItemLayoutProps) {
  const balanceAsString = convertAmountToBaseUnit(token.balance ?? new BigNumber(0)).toString();
  const formattedBalance = formatBalance(balanceAsString);
  const balanceAsFiat = convertAssetBalanceToFiat(token);

  return (
    <Pressable onClick={onClick} my="space.02">
      <ItemLayout
        flagImg={<Brc20AvatarIcon />}
        titleLeft={token.ticker}
        captionLeft="BRC-20"
        titleRight={
          <BasicTooltip
            asChild
            label={formattedBalance?.isAbbreviated ? balanceAsString : undefined}
            side="left"
          >
            <styled.span data-testid={token.ticker} textStyle="label.02">
              {formattedBalance.value}
            </styled.span>
          </BasicTooltip>
        }
        captionRight={balanceAsFiat}
      />
    </Pressable>
  );
}
