import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { sumNumbers } from '@app/common/utils';
import { createMoney } from '@shared/models/money.model';

import { useGetUtxosByAddressQuery } from './utxos-by-address.query';
import { createBitcoinCryptoCurrencyAssetTypeWrapper } from './address.utils';

function useBitcoinBalance(address: string) {
  const utxos = useGetUtxosByAddressQuery(address).data;
  return useMemo(() => {
    if (!utxos) return createMoney(new BigNumber(0), 'BTC');
    return createMoney(sumNumbers(utxos.map((utxo: any) => utxo.value)), 'BTC');
  }, [utxos]);
}

export function useBitcoinCryptoCurrencyAssetBalance(address: string) {
  const balance = useBitcoinBalance(address);
  return useMemo(() => {
    return createBitcoinCryptoCurrencyAssetTypeWrapper(balance);
  }, [balance]);
}
