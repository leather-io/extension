import { useMemo } from 'react';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { createBitcoinCryptoCurrencyAssetTypeWrapper } from '../address/address.utils';
import { useGetBitcoinBalanceByAddress } from './btc-balance.hooks';

// Balance is derived from a single query in address reuse mode
export function useNativeSegwitBalance(address: string) {
  const { balance, isInitialLoading, isLoading } = useGetBitcoinBalanceByAddress(address);

  const wrappedBalance = useMemo(
    () => createBitcoinCryptoCurrencyAssetTypeWrapper(balance),
    [balance]
  );

  return {
    btcBalance: wrappedBalance,
    isInitialLoading,
    isLoading,
  };
}

export function useCurrentNativeSegwitAddressBalance() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useGetBitcoinBalanceByAddress(nativeSegwitSigner.address);
}
