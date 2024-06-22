import { useEffect } from 'react';

import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { Stx20AvatarIcon } from '@app/ui/components/avatar/stx20-avatar-icon';

interface Stx20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Stx20CryptoAssetInfo;
}

interface Stx20TokenAssetListProps {
  tokens: Stx20TokenAssetDetails[];
  hasTokenSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function Stx20TokenAssetList({ tokens, hasTokenSetter }: Stx20TokenAssetListProps) {
  useEffect(() => {
    if (hasTokenSetter && tokens.length) hasTokenSetter(true);
  }, [tokens.length, hasTokenSetter]);

  if (!tokens.length) return null;
  return tokens.map((token, i) => (
    <CryptoAssetItemLayout
      availableBalance={token.balance.availableBalance}
      captionLeft={token.info.name.toUpperCase()}
      icon={<Stx20AvatarIcon />}
      key={`${token.info.symbol}${i}`}
      titleLeft={token.info.symbol}
    />
  ));
}
