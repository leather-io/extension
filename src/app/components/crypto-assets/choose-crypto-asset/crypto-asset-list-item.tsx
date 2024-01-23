import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoCurrencyAssetItemLayout } from '../crypto-currency-asset/crypto-currency-asset-item.layout';
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
        <CryptoCurrencyAssetItemLayout
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
