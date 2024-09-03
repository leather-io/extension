import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack } from 'leather-styles/jsx';

import type { Brc20CryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather.io/models';
import { Brc20AvatarIcon } from '@leather.io/ui';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { AssetListVariant } from '@app/features/asset-list/asset-list';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

interface Brc20TokenAssetDetails {
  balance: CryptoAssetBalance;
  holderAddress: string;
  info: Brc20CryptoAssetInfo;
  marketData: MarketData;
}

interface Brc20TokenAssetListProps {
  tokens: Brc20TokenAssetDetails[];
  variant?: AssetListVariant;
}

function getBrc20TokenFiatBalance(token: Brc20TokenAssetDetails) {
  return convertAssetBalanceToFiat({
    balance: token.balance.availableBalance,
    marketData: token.marketData,
  });
}

export function Brc20TokenAssetList({ tokens }: Brc20TokenAssetListProps) {
  const { isLoading } = useCurrentBtcCryptoAssetBalanceNativeSegwit();

  if (!tokens.length) return null;
  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList}>
      {tokens.map(token => (
        <CryptoAssetItemLayout
          availableBalance={token.balance.availableBalance}
          captionLeft={token.info.name.toUpperCase()}
          icon={<Brc20AvatarIcon />}
          isLoading={isLoading}
          key={token.info.symbol}
          titleLeft={token.info.symbol}
          fiatBalance={getBrc20TokenFiatBalance(token)}
        />
      ))}
    </Stack>
  );
}
