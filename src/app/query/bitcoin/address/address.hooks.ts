// @ts-nocheck
import { sumNumbers } from '@app/common/utils';
import { BTC_DECIMALS } from '@shared/constants';

import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

// TODO: Export when needed and remove ts-nocheck
// TODO: Kill these and use query hook directly
function useGetUtxosByAddress(address: string) {
  return useGetUtxosByAddressQuery(address).data;
}

function useGetBalanceByAddress(address: string) {
  const utxos = useGetUtxosByAddressQuery(address).data;
  if (!utxos) return;
  return sumNumbers(utxos.map(utxo => utxo.value)).shiftedBy(-BTC_DECIMALS);
}
