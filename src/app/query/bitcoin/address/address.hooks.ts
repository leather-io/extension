import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

export function useCurrentNativeSegwitUtxos() {
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  return useGetUtxosByAddressQuery(currentAccountBtcAddress);
}
