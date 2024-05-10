import { styled } from 'leather-styles/jsx';

import { formatBalance } from '@app/common/format-balance';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import type { RuneToken } from '@app/query/bitcoin/bitcoin-client';
import { RunesAvatarIcon } from '@app/ui/components/avatar/runes-avatar-icon';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { Pressable } from '@app/ui/pressable/pressable';

interface RunesAssetItemLayoutProps {
  rune: RuneToken;
}
export function RunesAssetItemLayout({ rune }: RunesAssetItemLayoutProps) {
  const { balance, tokenData } = rune;
  const balanceAsString = convertAmountToBaseUnit(balance).toString();
  const formattedBalance = formatBalance(balanceAsString);

  return (
    <Pressable my="space.02">
      <ItemLayout
        flagImg={<RunesAvatarIcon />}
        titleLeft={tokenData.spaced_rune_name ?? tokenData.rune_name}
        captionLeft="Runes"
        titleRight={
          <BasicTooltip
            asChild
            label={formattedBalance.isAbbreviated ? balanceAsString : undefined}
            side="left"
          >
            <styled.span data-testid={tokenData.rune_name} fontWeight={500} textStyle="label.02">
              {formattedBalance.value} {tokenData.symbol}
            </styled.span>
          </BasicTooltip>
        }
      />
    </Pressable>
  );
}
