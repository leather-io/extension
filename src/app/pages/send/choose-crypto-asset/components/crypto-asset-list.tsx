import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoAssetListItem } from './crypto-asset-list-item';
import { CryptoAssetListLayout } from './crypto-asset-list.layout';

interface CryptoAssetListProps {
  cryptoAssetBalances: AllTransferableCryptoAssetBalances[];
}
export function CryptoAssetList({ cryptoAssetBalances }: CryptoAssetListProps) {
  return (
    <CryptoAssetListLayout>
      {cryptoAssetBalances.map(assetBalance => (
        <CryptoAssetListItem assetBalance={assetBalance} key={assetBalance.asset.name} />
      ))}
    </CryptoAssetListLayout>
  );
}
