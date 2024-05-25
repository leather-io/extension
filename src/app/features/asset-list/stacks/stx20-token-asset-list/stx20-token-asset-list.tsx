import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather-wallet/models';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { Stx20AvatarIcon } from '@app/ui/components/avatar/stx20-avatar-icon';

interface Stx20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Stx20CryptoAssetInfo;
}

interface Stx20TokenAssetListProps {
  tokens: Stx20TokenAssetDetails[];
}
export function Stx20TokenAssetList({ tokens }: Stx20TokenAssetListProps) {
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
