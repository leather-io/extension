import { useCurrentNativeSegwitAccount } from './native-segwit-account.hooks';
import { useCurrentTaprootAccount } from './taproot-account.hooks';

// Checks for both TR and NativeSegwit hooks
export function useHasCurrentBitcoinAccount() {
  const nativeSegwit = useCurrentNativeSegwitAccount();
  const taproot = useCurrentTaprootAccount();
  return !!nativeSegwit && !!taproot;
}
