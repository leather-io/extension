import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';
import { Stx20AvatarIcon } from '@app/ui/components/avatar/stx20-avatar-icon';

interface Stx20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Stx20CryptoAssetInfo;
}

interface Stx20TokenAssetListProps {
  tokens: Stx20TokenAssetDetails[];
}
export function Stx20TokenAssetList({ tokens }: Stx20TokenAssetListProps) {
  const isPrivate = useIsPrivateMode();

  return tokens.map((token, i) => (
    <CryptoAssetItemLayout
      availableBalance={token.balance.availableBalance}
      captionLeft={token.info.name.toUpperCase()}
      icon={<Stx20AvatarIcon />}
      key={`${token.info.symbol}${i}`}
      titleLeft={token.info.symbol}
      isPrivate={isPrivate}
    />
  ));
}
