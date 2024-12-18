import { useCallback } from 'react';

import BtcAvatarIconSrc from '@assets/avatars/btc-avatar-icon.png';
import type { P2Ret } from '@scure/btc-signer/payment';

import { type SwapAsset, useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import type { Signer } from '@app/store/accounts/blockchain/bitcoin/bitcoin-signer';

export function useBtcSwapAsset(btcSigner?: Signer<P2Ret>) {
  const currentBitcoinAddress = btcSigner?.address ?? '';
  const { balance } = useBtcCryptoAssetBalanceNativeSegwit(currentBitcoinAddress);
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  return useCallback((): SwapAsset => {
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
