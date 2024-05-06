import { useGetBitcoinBalanceByAddress } from '@leather-wallet/query';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

// Balance is derived from a single query in address reuse mode
export { useNativeSegwitBalance } from '@leather-wallet/query';

export function useCurrentNativeSegwitAddressBalance() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  return useGetBitcoinBalanceByAddress(nativeSegwitSigner.address);
}
