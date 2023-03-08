import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { sumNumbers } from '@app/common/utils';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { createBitcoinCryptoCurrencyAssetTypeWrapper } from '../address/address.utils';
import { useGetUtxosByAddressQuery } from '../address/utxos-by-address.query';
import { useOrdinalsAwareUtxoQueries } from '../ordinals/use-ordinals-aware-utxo.query';
import { useTaprootAddressUtxosQuery } from '../ordinals/use-taproot-address-utxos.query';

function useGetBitcoinBalanceByAddress(address: string) {
  const utxos = useGetUtxosByAddressQuery(address).data;
  return useMemo(() => {
    if (!utxos) return createMoney(new BigNumber(0), 'BTC');
    return createMoney(sumNumbers(utxos.map(utxo => utxo.value)), 'BTC');
  }, [utxos]);
}

// While wallet is in address reuse mode, it's simple enough to establish
//balance from a single query
export function useNativeSegwitBalance(address: string) {
  const balance = useGetBitcoinBalanceByAddress(address);
  return useMemo(() => createBitcoinCryptoCurrencyAssetTypeWrapper(balance), [balance]);
}

export function useCurrentNativeSegwitAddressBalance() {
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  return useGetBitcoinBalanceByAddress(currentAccountBtcAddress);
}

// Must be ordinals-aware and exclude utxo values that contain inscriptions
export function useCurrentTaprootAccountBalance() {
  const { data: utxos = [] } = useTaprootAddressUtxosQuery();
  const utxoQueries = useOrdinalsAwareUtxoQueries(
    utxos.map(u => ({ txid: u.txid, index: u.vout })) ?? []
  );
  return useMemo(
    () =>
      createMoney(
        sumNumbers(
          utxoQueries
            .map(query => query.data)
            .filter(isDefined)
            .filter(utxo => !utxo.inscriptions)
            .map(utxo => Number(utxo.value))
        ),
        'BTC'
      ),
    [utxoQueries]
  );
}
