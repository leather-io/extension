import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { useGetUtxosByAddressQuery } from './utxos-by-address.query';

/**
 * Warning: ⚠️ These are **all** UTXOs, including Stamped and Inscribed UTXOs.
 * You should probably use `useSpendableCurrentNativeSegwitAccountUtxos` instead.
 */
export function useCurrentNativeSegwitUtxos() {
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  return useGetUtxosByAddressQuery(currentAccountBtcAddress);
}
