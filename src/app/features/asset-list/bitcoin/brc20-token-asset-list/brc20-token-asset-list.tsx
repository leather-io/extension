import { useNavigate } from 'react-router-dom';

import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { capitalize } from '@app/common/utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { AssetItem, AssetListVariant } from '@app/features/asset-list/asset-list';
import { useCurrentBtcAvailableBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { Brc20AvatarIcon } from '@app/ui/components/avatar/brc20-avatar-icon';

interface Brc20AssetItem extends AssetItem {
  holderAddress: string;
}

interface Brc20TokenAssetListProps {
  tokens: Brc20AssetItem[];
  variant?: AssetListVariant;
}
export function Brc20TokenAssetList({ tokens, variant }: Brc20TokenAssetListProps) {
  const navigate = useNavigate();
  const { balance, isInitialLoading } = useCurrentBtcAvailableBalanceNativeSegwit();

  const hasPositiveBtcBalanceForFees = variant === 'interactive' && balance.amount.isGreaterThan(0);

  function navigateToBrc20SendForm(token: Brc20AssetItem) {
    const { balance, holderAddress, assetInfo, marketData } = token;
    navigate(RouteUrls.SendBrc20SendForm.replace(':ticker', assetInfo.symbol), {
      state: {
        balance: balance.availableBalance,
        holderAddress,
        marketData,
        ticker: assetInfo.symbol,
      },
    });
  }

  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {tokens.map(token => (
        <CryptoAssetItemLayout
          balance={token.balance}
          caption={capitalize(token.assetInfo.name)}
          icon={<Brc20AvatarIcon />}
          isLoading={isInitialLoading}
          key={token.assetInfo.symbol}
          name={token.assetInfo.name}
          onClick={hasPositiveBtcBalanceForFees ? () => navigateToBrc20SendForm(token) : undefined}
          symbol={token.assetInfo.symbol}
        />
      ))}
    </Stack>
  );
}
