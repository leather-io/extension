import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoAssetListItem } from './crypto-asset-list-item';
import { CryptoAssetListLayout } from './crypto-asset-list.layout';

interface CryptoAssetListProps {
  cryptoAssetBalances: AllTransferableCryptoAssetBalances[];
  onItemClick: (props: { cryptoAssetBalance: AllTransferableCryptoAssetBalances }) => void;
}
export function CryptoAssetList({ cryptoAssetBalances, onItemClick }: CryptoAssetListProps) {
  return (
    <CryptoAssetListLayout>
      {cryptoAssetBalances.map(assetBalance => (
        <CryptoAssetListItem
          onClick={() => onItemClick({ cryptoAssetBalance: assetBalance })}
          assetBalance={assetBalance}
          key={assetBalance.asset.name}
        />
      ))}
    </CryptoAssetListLayout>
  );
}
