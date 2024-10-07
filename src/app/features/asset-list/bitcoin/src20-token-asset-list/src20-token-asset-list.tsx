import { Src20AvatarIcon } from '@leather.io/ui';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { Src20TokenAssetDetails } from '@app/components/loaders/src20-tokens-loader';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

interface Src20TokenAssetListProps {
  tokens: Src20TokenAssetDetails[];
}
export function Src20TokenAssetList({ tokens }: Src20TokenAssetListProps) {
  const isPrivate = useIsPrivateMode();

  return tokens.map((token, i) => (
    <CryptoAssetItemLayout
      availableBalance={token.balance.availableBalance}
      captionLeft={token.info.name.toUpperCase()}
      key={`${token.info.id}${i}`}
      icon={<Src20AvatarIcon />}
      titleLeft={token.info.symbol.toUpperCase()}
      isPrivate={isPrivate}
    />
  ));
}
