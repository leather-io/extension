import { BitcoinAccount } from '@shared/crypto/bitcoin/bitcoin.utils';

import { useCurrentNativeSegwitAccount } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

interface CurrentBitcoinAccountLoaderProps {
  children(data: { nativeSegwit: BitcoinAccount; taproot: BitcoinAccount }): React.ReactNode;
}
export function CurrentBitcoinAccountLoader({ children }: CurrentBitcoinAccountLoaderProps) {
  const nativeSegwit = useCurrentNativeSegwitAccount();
  const taproot = useCurrentTaprootAccount();
  if (!taproot || !nativeSegwit) return null;
  return children({ nativeSegwit, taproot });
}
