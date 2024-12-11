import { useCallback } from 'react';

import BtcAvatarIconSrc from '@assets/avatars/btc-avatar-icon.png';
import SbtcAvatarIconSrc from '@assets/avatars/sbtc-avatar-icon.png';

import { BTC_DECIMALS } from '@leather.io/constants';
import {
  type SwapAsset,
  useCryptoCurrencyMarketDataMeanAverage,
  useSip10Token,
} from '@leather.io/query';
import { createMoney, getPrincipalFromContractId } from '@leather.io/utils';

import { castBitcoinMarketDataToSbtcMarketData } from '@app/common/hooks/use-calculate-sip10-fiat-value';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useBtcSwapAsset() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentBitcoinAddress = nativeSegwitSigner.address;
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

export function useSbtcSwapAsset() {
  const stxAddress = useCurrentStacksAccountAddress();
  const { contractId } = useConfigSbtc();
  const token = useSip10Token(stxAddress, contractId);
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  return useCallback((): SwapAsset => {
    return {
      balance: token?.balance.availableBalance ?? createMoney(0, 'sBTC', BTC_DECIMALS),
      tokenId: 'token-sbtc',
      displayName: 'sBTC',
      fallback: 'SB',
      icon: SbtcAvatarIconSrc,
      name: 'sBTC',
      marketData: castBitcoinMarketDataToSbtcMarketData(bitcoinMarketData),
      principal: getPrincipalFromContractId(contractId),
    };
  }, [bitcoinMarketData, contractId, token?.balance.availableBalance]);
}
