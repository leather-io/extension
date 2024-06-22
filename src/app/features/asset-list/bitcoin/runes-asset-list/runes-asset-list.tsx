import { type ReactNode, useEffect } from 'react';

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
  showBalance?: boolean;
  renderRightElement?(id: string): ReactNode;
  hasRunesSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function RunesAssetList({
  runes,
  renderRightElement,
  hasRunesSetter,
  showBalance = true,
}: RunesAssetListProps) {
  useEffect(() => {
    if (hasRunesSetter && runes.length) hasRunesSetter(true);
  }, [runes.length, hasRunesSetter]);

  if (!runes.length) return null;
  return runes.map((rune, i) => (
    <CryptoAssetItemLayout
      availableBalance={
        showBalance
          ? createMoneyFromDecimal(
              convertAmountToBaseUnit(rune.balance.availableBalance),
              rune.info.symbol,
              rune.info.decimals
            )
          : null
      }
      balanceSuffix={rune.info.symbol}
      captionLeft="Runes"
      icon={<RunesAvatarIcon />}
      key={`${rune.info.symbol}${i}`}
      titleLeft={rune.info.spacedRuneName ?? rune.info.runeName}
      renderRightElement={renderRightElement}
    />
  ));
}
