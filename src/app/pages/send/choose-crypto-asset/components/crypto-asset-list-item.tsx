import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';

import { CryptoCurrencyAssetIcon } from './crypto-currency-asset-icon';
import { FungibleTokenAssetItem } from './fungible-token-asset-item';

interface CryptoAssetListItemProps {
  assetBalance: AllTransferableCryptoAssetBalances;
  onClick: () => void;
}
export function CryptoAssetListItem(props: CryptoAssetListItemProps) {
  const { assetBalance } = props;
  const { blockchain, type } = assetBalance;

  switch (type) {
    case 'crypto-currency':
      return (
        <CryptoCurrencyAssetItem
          assetBalance={assetBalance}
          icon={<CryptoCurrencyAssetIcon blockchain={blockchain} />}
          isPressable
          onClick={props.onClick}
        />
      );
    case 'fungible-token':
      return <FungibleTokenAssetItem assetBalance={assetBalance} onClick={props.onClick} />;
    default:
      return null;
  }
}
