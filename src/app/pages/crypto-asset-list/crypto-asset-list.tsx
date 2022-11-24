import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoAssetListItem } from './components/crypto-asset-list-item';
import { CryptoAssetListLayout } from './components/crypto-asset-list.layout';

interface CryptoAssetListProps {
  cryptoAssetBalances: AllTransferableCryptoAssetBalances[];
}
export function CryptoAssetList({ cryptoAssetBalances }: CryptoAssetListProps) {
  return (
    <CryptoAssetListLayout>
      {cryptoAssetBalances.map(assetBalance => (
        <CryptoAssetListItem
          assetBalance={assetBalance}
          data-testid={assetBalance.asset.symbol}
          key={assetBalance.asset.name}
        />
      ))}
    </CryptoAssetListLayout>
  );
}
