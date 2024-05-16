import type { MarketData, StxCryptoAssetBalance, StxCryptoAssetInfo } from '@leather-wallet/models';

import { STX_DECIMALS } from '@shared/constants';

import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { isFetchedWithSuccess } from '@app/query/query-config';
import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/account-balance.hooks';

const stxCryptoAssetInfo: StxCryptoAssetInfo = {
  decimals: STX_DECIMALS,
  hasMemo: true,
  name: 'stacks',
  symbol: 'STX',
};

interface StxCryptoAssetLoaderProps {
  address: string;
  children(
    token: {
      assetInfo: StxCryptoAssetInfo;
      balance: StxCryptoAssetBalance;
      marketData: MarketData;
    },
    isInitialLoading: boolean
  ): React.ReactNode;
}
export function StxCryptoAssetLoader({ address, children }: StxCryptoAssetLoaderProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const query = useStxCryptoAssetBalance(address);
  if (!isFetchedWithSuccess(query)) return;
  return children(
    { assetInfo: stxCryptoAssetInfo, balance: query.data, marketData },
    query.isInitialLoading
  );
}
