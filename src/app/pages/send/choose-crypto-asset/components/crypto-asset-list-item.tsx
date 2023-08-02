import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import type {
  AllTransferableCryptoAssetBalances,
  StacksFungibleTokenAssetBalance,
} from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { CryptoCurrencyAssetItem } from '@app/components/crypto-assets/crypto-currency-asset/crypto-currency-asset-item';
import { useConfigBitcoinSendEnabled } from '@app/query/common/remote-config/remote-config.query';

import { CryptoCurrencyAssetIcon } from './crypto-currency-asset-icon';
import { FungibleTokenAssetItem } from './fungible-token-asset-item';

interface CryptoAssetListItemProps {
  assetBalance: AllTransferableCryptoAssetBalances;
}
export function CryptoAssetListItem(props: CryptoAssetListItemProps) {
  const { assetBalance } = props;
  const { blockchain, type, asset } = assetBalance;
  const navigate = useNavigate();
  const isBitcoinSendEnabled = useConfigBitcoinSendEnabled();

  function navigateToSendForm({ isFtToken = false }: { isFtToken: boolean }) {
    if (asset.symbol === 'BTC' && !isBitcoinSendEnabled) {
      return navigate(RouteUrls.SendBtcDisabled);
    }
    const symbol = asset.symbol === '' ? asset.contractAssetName : asset.symbol.toLowerCase();

    if (isFtToken) {
      const asset = (assetBalance as StacksFungibleTokenAssetBalance).asset;
      if (!asset.contractId) {
        toast.error('Unable to find contract id');
        return navigate('..');
      }
      const contractId = `${asset.contractId.split('::')[0]}`;
      return navigate(`${RouteUrls.SendCryptoAsset}/${symbol}/${contractId}`);
    }
    navigate(`${RouteUrls.SendCryptoAsset}/${symbol}`);
  }

  switch (type) {
    case 'crypto-currency':
      return (
        <CryptoCurrencyAssetItem
          assetBalance={assetBalance}
          icon={<CryptoCurrencyAssetIcon blockchain={blockchain} />}
          isPressable
          onClick={() => navigateToSendForm({ isFtToken: false })}
        />
      );
    case 'fungible-token':
      return (
        <FungibleTokenAssetItem
          assetBalance={assetBalance}
          onClick={() => navigateToSendForm({ isFtToken: true })}
        />
      );
    default:
      return null;
  }
}
