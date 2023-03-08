import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

export function useCurrentNativeSegwitUtxos() {
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  return useGetUtxosByAddressQuery(currentAccountBtcAddress);
}
