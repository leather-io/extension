import { useMemo } from 'react';

import BtcAvatarIconSrc from '@assets/avatars/btc-avatar-icon.png';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useBtcSwapAsset() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const currentBitcoinAddress = nativeSegwitSigner?.address ?? '';
  const { balance } = useBtcCryptoAssetBalanceNativeSegwit(currentBitcoinAddress);
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
