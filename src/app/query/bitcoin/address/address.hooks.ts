import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/utils';

import { createBitcoinCryptoCurrencyAssetTypeWrapper } from './address.utils';
import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

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
