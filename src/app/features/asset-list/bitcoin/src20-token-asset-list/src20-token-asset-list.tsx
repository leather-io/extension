import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { Src20TokenAssetDetails } from '@app/components/loaders/src20-tokens-loader';
import { Src20AvatarIcon } from '@app/ui/components/avatar/src20-avatar-icon';

interface Src20TokenAssetListProps {
  tokens: Src20TokenAssetDetails[];
}
export function Src20TokenAssetList({ tokens }: Src20TokenAssetListProps) {
  return tokens.map((token, i) => (
    <CryptoAssetItemLayout
      balance={token.balance}
      captionLeft={token.info.name.toUpperCase()}
      key={`${token.info.id}${i}`}
      icon={<Src20AvatarIcon />}
      titleLeft={token.info.symbol.toUpperCase()}
    />
  ));
}
