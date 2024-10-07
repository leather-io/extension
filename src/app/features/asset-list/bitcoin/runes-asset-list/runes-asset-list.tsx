import type { CryptoAssetBalance, MarketData, RuneCryptoAssetInfo } from '@leather.io/models';
import { RunesAvatarIcon } from '@leather.io/ui';
import { convertAmountToBaseUnit, createMoneyFromDecimal } from '@leather.io/utils';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

interface RuneTokenAssetDetails {
  balance: CryptoAssetBalance;
  info: RuneCryptoAssetInfo;
  marketData: MarketData;
}

interface RunesAssetListProps {
  runes: RuneTokenAssetDetails[];
}

export function RunesAssetList({ runes }: RunesAssetListProps) {
  const isPrivate = useIsPrivateMode();

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
      fiatBalance={convertAssetBalanceToFiat({
        balance: rune.balance.availableBalance,
        marketData: rune.marketData,
      })}
      isPrivate={isPrivate}
    />
  ));
}
