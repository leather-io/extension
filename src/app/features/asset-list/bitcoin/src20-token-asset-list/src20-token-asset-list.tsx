import { type ReactNode, useEffect } from 'react';

import { Src20AvatarIcon } from '@leather.io/ui';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { Src20TokenAssetDetails } from '@app/components/loaders/src20-tokens-loader';

interface Src20TokenAssetListProps {
  tokens: Src20TokenAssetDetails[];
  showBalance?: boolean;
  renderRightElement?(id: string): ReactNode;
  hasTokenSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function Src20TokenAssetList({
  tokens,
  renderRightElement,
  hasTokenSetter,
  showBalance = true,
}: Src20TokenAssetListProps) {
  useEffect(() => {
    if (hasTokenSetter && tokens.length) hasTokenSetter(true);
  }, [tokens.length, hasTokenSetter]);

  if (!tokens.length) return null;
  return tokens.map((token, i) => (
    <CryptoAssetItemLayout
      availableBalance={showBalance ? token.balance.availableBalance : null}
      captionLeft={token.info.name.toUpperCase()}
      key={`${token.info.id}${i}`}
      icon={<Src20AvatarIcon />}
      titleLeft={token.info.symbol.toUpperCase()}
      renderRightElement={renderRightElement}
    />
  ));
}
