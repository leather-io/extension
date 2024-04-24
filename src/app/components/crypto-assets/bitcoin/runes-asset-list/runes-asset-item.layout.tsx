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
  const balanceAsString = convertAmountToBaseUnit(rune.balance).toString();
  const formattedBalance = formatBalance(balanceAsString);

  return (
    <Pressable my="space.02">
      <ItemLayout
        flagImg={<RunesAvatarIcon />}
        titleLeft={rune.spaced_rune_name ?? rune.rune_name}
        captionLeft="Runes"
        titleRight={
          <BasicTooltip
            asChild
            label={formattedBalance.isAbbreviated ? balanceAsString : undefined}
            side="left"
          >
            <styled.span data-testid={rune.rune_name} fontWeight={500} textStyle="label.02">
              {formattedBalance.value} {rune.symbol}
            </styled.span>
          </BasicTooltip>
        }
      />
    </Pressable>
  );
}
