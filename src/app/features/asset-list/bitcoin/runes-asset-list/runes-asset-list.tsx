import type { CryptoAssetBalance, RuneCryptoAssetInfo } from '@leather.io/models';
import { RunesAvatarIcon } from '@leather.io/ui';
import { convertAmountToBaseUnit, createMoneyFromDecimal } from '@leather.io/utils';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';

interface RuneTokenAssetDetails {
  balance: CryptoAssetBalance;
  info: RuneCryptoAssetInfo;
}

interface RunesAssetListProps {
  runes: RuneTokenAssetDetails[];
}
export function RunesAssetList({ runes }: RunesAssetListProps) {
  return runes.map((rune, i) => (
    <CryptoAssetItemLayout
      availableBalance={createMoneyFromDecimal(
        convertAmountToBaseUnit(rune.balance.availableBalance),
        rune.info.symbol,
        rune.info.decimals
      )}
      balanceSuffix={rune.info.symbol}
      captionLeft="Runes"
      icon={<RunesAvatarIcon />}
      key={`${rune.info.symbol}${i}`}
      titleLeft={rune.info.spacedRuneName ?? rune.info.runeName}
    />
  ));
}
