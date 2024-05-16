import type { BtcCryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather-wallet/models';

import { BTC_DECIMALS } from '@shared/constants';

import { useGetBitcoinBalanceByAddress } from '@app/query/bitcoin/balance/btc-balance.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { createCryptoAssetBalance } from '@app/query/common/models';

const btcCryptoAssetInfo: BtcCryptoAssetInfo = {
  decimals: BTC_DECIMALS,
  hasMemo: false,
  name: 'bitcoin',
  symbol: 'BTC',
};

interface BtcCryptoAssetLoaderProps {
  address: string;
  children(
    token: { assetInfo: BtcCryptoAssetInfo; balance: CryptoAssetBalance; marketData: MarketData },
    isInitialLoading: boolean
  ): React.ReactNode;
}
export function BtcCryptoAssetLoader({ address, children }: BtcCryptoAssetLoaderProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { balance, isInitialLoading } = useGetBitcoinBalanceByAddress(address);
  return children(
    { assetInfo: btcCryptoAssetInfo, balance: createCryptoAssetBalance(balance), marketData },
    isInitialLoading
  );
}
