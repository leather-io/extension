import { useGetBitcoinBalanceByAddress } from '@leather-wallet/query';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useCurrentNativeSegwitAddressBalance() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useGetBitcoinBalanceByAddress(nativeSegwitSigner.address);
}
