import type { CryptoAssetBalance, RuneCryptoAssetInfo } from '@leather-wallet/models';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { RunesAvatarIcon } from '@app/ui/components/avatar/runes-avatar-icon';

interface RuneTokenAssetDetails {
  balance: CryptoAssetBalance;
  info: RuneCryptoAssetInfo;
}

interface RunesAssetListProps {
  runes: RuneTokenAssetDetails[];
}
export function RunesAssetList({ runes }: RunesAssetListProps) {
  return runes.map((rune, i) => (
    <CryptoAssetItemLayout
      balance={rune.balance}
      captionLeft="Runes"
      icon={<RunesAvatarIcon />}
      key={`${rune.info.symbol}${i}`}
      titleLeft={rune.info.spacedRuneName ?? rune.info.runeName}
    />
  ));
}
