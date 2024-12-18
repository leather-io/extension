import { useNativeSegwitUtxosByAddress } from '@leather.io/query';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useCurrentNativeSegwitUtxos() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const address = nativeSegwitSigner.address;

  return useNativeSegwitUtxosByAddress({
    address,
    filterInscriptionUtxos: false,
    filterPendingTxsUtxos: true,
    filterRunesUtxos: false,
  });
}
