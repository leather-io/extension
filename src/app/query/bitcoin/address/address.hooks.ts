// @ts-nocheck
import { sumNumbers } from '@app/common/utils';
import { BTC_DECIMALS } from '@shared/constants';

import { useGetTransactionsByAddressQuery } from './transactions-by-address.query';
import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

// TODO: Export when needed and remove ts-nocheck
// Possibly kill these and use query hook directly
function useGetTransactionsByAddress(address: string) {
  return useGetTransactionsByAddressQuery(address).data;
}

function useGetUtxosByAddress(address: string) {
  return useGetUtxosByAddressQuery(address).data;
}

function useGetBalanceByAddress(address: string) {
  const utxos = useGetUtxosByAddressQuery(address).data;
  if (!utxos) return;
  return sumNumbers(utxos.map(utxo => utxo.value)).shiftedBy(-BTC_DECIMALS);
}
