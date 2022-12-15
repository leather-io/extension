import { useNavigate } from 'react-router-dom';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';

import { CryptoCurrencyAssetIcon } from './crypto-currency-asset-icon';
import { FungibleTokenAssetItem } from './fungible-token-asset-item';

interface CryptoAssetListItemProps {
  assetBalance: AllTransferableCryptoAssetBalances;
}
export function CryptoAssetListItem(props: CryptoAssetListItemProps) {
  const { assetBalance } = props;
  const { blockchain, type, asset } = assetBalance;
  const navigate = useNavigate();

  function navigateToSendForm(state?: object) {
    navigate(`${RouteUrls.SendCryptoAsset}/${asset.symbol.toLowerCase()}`, { state });
  }

  switch (type) {
    case 'crypto-currency':
      return (
        <CryptoCurrencyAssetItem
          assetBalance={assetBalance}
          icon={<CryptoCurrencyAssetIcon blockchain={blockchain} />}
          isPressable
          onClick={navigateToSendForm}
        />
      );
    case 'fungible-token':
      return (
        <FungibleTokenAssetItem
          assetBalance={assetBalance}
          onClick={() => navigateToSendForm({ contractId: assetBalance.asset.contractId })}
        />
      );
    default:
      return null;
  }
}
