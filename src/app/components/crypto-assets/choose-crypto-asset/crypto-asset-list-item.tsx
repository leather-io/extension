import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoAssetItemLayout } from '../crypto-asset-item/crypto-asset-item.layout';
import { CryptoCurrencyAssetIcon } from './crypto-currency-asset-icon';
import { FungibleTokenAssetItem } from './fungible-token-asset-item';

interface CryptoAssetListItemProps {
  assetBalance: AllTransferableCryptoAssetBalances;
  onClick(): void;
}
export function CryptoAssetListItem(props: CryptoAssetListItemProps) {
  const { assetBalance, onClick } = props;
  const { blockchain, type } = assetBalance;

  switch (type) {
    case 'crypto-currency':
      return (
        <CryptoAssetItemLayout
          assetBalance={assetBalance}
          icon={<CryptoCurrencyAssetIcon blockchain={blockchain} />}
          onClick={onClick}
        />
      );
    case 'fungible-token':
      return <FungibleTokenAssetItem assetBalance={assetBalance} onClick={onClick} />;
    default:
      return null;
  }
}
