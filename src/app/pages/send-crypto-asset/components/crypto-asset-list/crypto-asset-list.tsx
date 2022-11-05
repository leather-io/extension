import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoAssetListItem } from './crypto-asset-list-item';
import { CryptoAssetListLayout } from './crypto-asset-list.layout';

interface CryptoAssetListProps {
  cryptoAssetBalances: AllTransferableCryptoAssetBalances[];
}
export function CryptoAssetList({ cryptoAssetBalances }: CryptoAssetListProps) {
  return (
    <CryptoAssetListLayout>
      {cryptoAssetBalances.map(assetBalance => {
        return (
          <CryptoAssetListItem
            assetBalance={assetBalance}
            data-testid={assetBalance.asset.symbol}
            key={assetBalance.asset.name}
          />
        );
      })}
    </CryptoAssetListLayout>
  );
}
