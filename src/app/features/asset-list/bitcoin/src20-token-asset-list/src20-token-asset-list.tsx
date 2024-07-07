import { useEffect } from 'react';

import { Src20AvatarIcon } from '@leather.io/ui';

import type { RightElementVariant } from '@app/common/asset-list-utils';
import { CryptoAssetItemBalanceLayout } from '@app/components/crypto-asset-item/crypto-asset-item-balance.layout';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import type { Src20TokenAssetDetails } from '@app/components/loaders/src20-tokens-loader';

interface Src20TokenAssetListProps {
  tokens: Src20TokenAssetDetails[];
  rightElementVariant: RightElementVariant;
  hasTokenSetter?(tokensLength: number): void;
}
export function Src20TokenAssetList({
  tokens,
  rightElementVariant,
  hasTokenSetter,
}: Src20TokenAssetListProps) {
  useEffect(() => {
    if (hasTokenSetter) hasTokenSetter(tokens.length);
  }, [tokens.length, hasTokenSetter]);

  if (!tokens?.length) return null;

  return tokens.map((token, i) => {
    const captionLeft = token.info.name.toUpperCase();
    const symbol = token.info.symbol.toUpperCase();

    if (rightElementVariant === 'toggle') {
      return (
        <CryptoAssetItemToggleLayout
          captionLeft={captionLeft}
          titleLeft={symbol}
          key={`${token.info.id}${i}`}
          icon={<Src20AvatarIcon />}
        />
      );
    }
    return (
      <CryptoAssetItemBalanceLayout
        availableBalance={token.balance.availableBalance}
        captionLeft={token.info.name.toUpperCase()}
        key={`${token.info.id}${i}`}
        icon={<Src20AvatarIcon />}
        titleLeft={symbol}
      />
    );
  });
}
