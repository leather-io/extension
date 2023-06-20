import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { sumNumbers } from '@app/common/math/helpers';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { createBitcoinCryptoCurrencyAssetTypeWrapper } from '../address/address.utils';
import { useSpendableNativeSegwitUtxos } from '../address/utxos-by-address.hooks';
import { useOrdinalsAwareUtxoQueries } from '../ordinals/ordinals-aware-utxo.query';
import { useTaprootAccountUtxosQuery } from '../ordinals/use-taproot-address-utxos.query';

function useGetBitcoinBalanceByAddress(address: string) {
  const utxos = useSpendableNativeSegwitUtxos(address).data;
  return useMemo(() => {
    if (!utxos) return createMoney(new BigNumber(0), 'BTC');
    return createMoney(sumNumbers(utxos.map(utxo => utxo.value)), 'BTC');
  }, [utxos]);
}

// While wallet is in address reuse mode, it's simple enough to establish
// balance from a single query
export function useNativeSegwitBalance(address: string) {
  const balance = useGetBitcoinBalanceByAddress(address);
  return useMemo(() => createBitcoinCryptoCurrencyAssetTypeWrapper(balance), [balance]);
}

export function useCurrentNativeSegwitAddressBalance() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useGetBitcoinBalanceByAddress(nativeSegwitSigner.address);
}

export function useCurrentTaprootAccountUninscribedUtxos() {
  const { data: utxos = [] } = useTaprootAccountUtxosQuery();
  const utxoQueries = useOrdinalsAwareUtxoQueries(utxos);

  return useMemo(
    () =>
      utxoQueries
        .map(query => query.data)
        .filter(isDefined)
        // If tx isn't confirmed, we can't tell yet whether or not it has
        // inscriptions
        .filter(utxo => utxo.status.confirmed)
        .filter(utxo => !utxo.inscriptions),
    [utxoQueries]
  );
}

// Must be ordinals-aware and exclude utxo values that contain inscriptions
export function useCurrentTaprootAccountBalance() {
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();
  return useMemo(
    () => createMoney(sumNumbers(uninscribedUtxos.map(utxo => Number(utxo.value))), 'BTC'),
    [uninscribedUtxos]
  );
}
