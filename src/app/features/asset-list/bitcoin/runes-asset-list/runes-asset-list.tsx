import { useEffect } from 'react';

import type { CryptoAssetBalance, RuneCryptoAssetInfo } from '@leather.io/models';
import { RunesAvatarIcon } from '@leather.io/ui';
import { convertAmountToBaseUnit, createMoneyFromDecimal } from '@leather.io/utils';

import type { RightElementVariant } from '@app/common/asset-list-utils';
import { CryptoAssetItemBalanceLayout } from '@app/components/crypto-asset-item/crypto-asset-item-balance.layout';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';

interface RuneTokenAssetDetails {
  balance: CryptoAssetBalance;
  info: RuneCryptoAssetInfo;
}

interface RunesAssetListProps {
  runes: RuneTokenAssetDetails[];
  rightElementVariant: RightElementVariant;
  hasRunesSetter?(tokensLength: number): void;
}

export function RunesAssetList({
  runes,
  rightElementVariant,
  hasRunesSetter,
}: RunesAssetListProps) {
  useEffect(() => {
    if (hasRunesSetter) hasRunesSetter(runes.length);
  }, [runes.length, hasRunesSetter]);

  if (!runes.length) return null;

  return runes.map((rune, i) => {
    const titleLeft = rune.info.spacedRuneName ?? rune.info.runeName;
    const captionLeft = 'Runes';
    const symbol = rune.info.symbol;
    if (rightElementVariant === 'toggle') {
      return (
        <CryptoAssetItemToggleLayout
          captionLeft={captionLeft}
          titleLeft={titleLeft}
          key={`${symbol}-${i}`}
          icon={<RunesAvatarIcon />}
        />
      );
    }
    return (
      <CryptoAssetItemBalanceLayout
        availableBalance={createMoneyFromDecimal(
          convertAmountToBaseUnit(rune.balance.availableBalance),
          rune.info.symbol,
          rune.info.decimals
        )}
        balanceSuffix={rune.info.symbol}
        captionLeft={captionLeft}
        icon={<RunesAvatarIcon />}
        key={`${rune.info.symbol}${i}`}
        titleLeft={titleLeft}
      />
    );
  });
}
