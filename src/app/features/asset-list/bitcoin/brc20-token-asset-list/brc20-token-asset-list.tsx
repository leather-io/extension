import { useNavigate } from 'react-router-dom';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { capitalize } from '@app/common/utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { AssetListVariant } from '@app/features/asset-list/asset-list';
import { useCurrentBtcAvailableBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import type { Brc20AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { Brc20AvatarIcon } from '@app/ui/components/avatar/brc20-avatar-icon';

interface Brc20TokenAssetListProps {
  assets: Brc20AccountCryptoAssetWithDetails[];
  variant?: AssetListVariant;
}
export function Brc20TokenAssetList({ assets, variant }: Brc20TokenAssetListProps) {
  const navigate = useNavigate();
  const { balance, isInitialLoading } = useCurrentBtcAvailableBalanceNativeSegwit();

  const hasPositiveBtcBalanceForFees = variant === 'interactive' && balance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(asset: Brc20AccountCryptoAssetWithDetails) {
    const { balance, holderAddress, info, marketData } = asset;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', info.symbol), {
      state: { balance: balance.availableBalance, holderAddress, marketData, ticker: info.symbol },
    });
  }

  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {assets.map(asset => (
        <CryptoAssetItemLayout
          asset={asset}
          caption={capitalize(asset.info.name)}
          icon={<Brc20AvatarIcon />}
          isLoading={isInitialLoading}
          key={asset.info.symbol}
          name={asset.info.symbol}
          onClick={hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(asset) : undefined}
        />
      ))}
    </Stack>
  );
}
