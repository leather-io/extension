import { useEffect } from 'react';

import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';

import type { RightElementVariant } from '@app/common/asset-list-utils';
import { CryptoAssetItemBalanceLayout } from '@app/components/crypto-asset-item/crypto-asset-item-balance.layout';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { Stx20AvatarIcon } from '@app/ui/components/avatar/stx20-avatar-icon';

interface Stx20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Stx20CryptoAssetInfo;
}

interface Stx20TokenAssetListProps {
  tokens: Stx20TokenAssetDetails[];
  rightElementVariant: RightElementVariant;
  hasTokenSetter?(tokensLength: number): void;
}
export function Stx20TokenAssetList({
  tokens,
  hasTokenSetter,
  rightElementVariant,
}: Stx20TokenAssetListProps) {
  useEffect(() => {
    if (hasTokenSetter) hasTokenSetter(tokens.length);
  }, [tokens.length, hasTokenSetter]);

  if (!tokens.length) return null;

  return tokens.map((token, i) => {
    const symbol = token.info.symbol;
    const captionLeft = token.info.name.toUpperCase();

    if (rightElementVariant === 'toggle') {
      return (
        <CryptoAssetItemToggleLayout
          captionLeft={captionLeft}
          titleLeft={symbol}
          key={`${symbol}-${i}`}
          icon={<Stx20AvatarIcon />}
        />
      );
    }

    return (
      <CryptoAssetItemBalanceLayout
        availableBalance={token.balance.availableBalance}
        captionLeft={captionLeft}
        icon={<Stx20AvatarIcon />}
        key={`${symbol}-${i}`}
        titleLeft={symbol}
      />
    );
  });
}
