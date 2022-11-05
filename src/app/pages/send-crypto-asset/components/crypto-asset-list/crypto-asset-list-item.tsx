import { useNavigate } from 'react-router-dom';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';

import { BlockchainFungibleTokenAssetItem } from './blockchain-fungible-token-asset-item';
import { CryptoCurrencyAssetIcon } from './crypto-currency-asset-icon';

interface CryptoAssetListItemProps {
  assetBalance: AllTransferableCryptoAssetBalances;
}
export function CryptoAssetListItem(props: CryptoAssetListItemProps) {
  const { assetBalance } = props;
  const { blockchain, type } = assetBalance;
  const navigate = useNavigate();

  switch (type) {
    case 'crypto-currency':
      return (
        <CryptoCurrencyAssetItem
          assetBalance={assetBalance}
          icon={<CryptoCurrencyAssetIcon blockchain={blockchain} />}
          isPressable
          onClick={() =>
            navigate(`${RouteUrls.SendCryptoAsset}/${blockchain}/${type}`, {
              state: { assetBalance },
            })
          }
        />
      );
    case 'fungible-token':
      return <BlockchainFungibleTokenAssetItem assetBalance={assetBalance} />;
    default:
      return null;
  }
}
