import { useMemo } from 'react';

import type { BtcCryptoAssetBalance, Money } from '@leather-wallet/models';

import { createMoney } from '@shared/models/money.model';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useGetBitcoinBalanceByAddress } from './btc-balance.hooks';

function createBtcCryptoAssetBalance(balance: Money): BtcCryptoAssetBalance {
  return {
    availableBalance: balance,
    // TODO: Can we determine these here or are they nec?
    protectedBalance: createMoney(0, 'BTC'),
    uneconomicalBalance: createMoney(0, 'BTC'),
  };
}

// Balance is derived from a single query in address reuse mode
export function useBtcCryptoAssetBalanceNativeSegwit(address: string) {
  const { balance, isInitialLoading, isLoading, isFetching } =
    useGetBitcoinBalanceByAddress(address);
  const btcCryptoAssetBalance = useMemo(() => createBtcCryptoAssetBalance(balance), [balance]);

  return {
    btcCryptoAssetBalance,
    isInitialLoading,
    isLoading,
    isFetching,
  };
}

export function useCurrentBtcAvailableBalanceNativeSegwit() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useGetBitcoinBalanceByAddress(nativeSegwitSigner.address);
}
