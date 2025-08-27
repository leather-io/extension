import { useMemo } from 'react';

import BtcAvatarIconSrc from '@assets/avatars/btc-avatar-icon.png';

import { useCurrentNativeSegwitBtcBalanceWithFallback } from '@app/query/bitcoin/balance/btc-balance.hooks';
import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

export function useBtcSwapAsset() {
  const { btc: balance } = useCurrentNativeSegwitBtcBalanceWithFallback();
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  return useMemo((): SwapAsset => {
    return {
      balance: balance.availableBalance,
      tokenId: 'token-btc',
      displayName: 'Bitcoin',
      fallback: 'BT',
      icon: BtcAvatarIconSrc,
      name: 'BTC',
      marketData: bitcoinMarketData,
      principal: '',
    };
  }, [balance.availableBalance, bitcoinMarketData]);
}
