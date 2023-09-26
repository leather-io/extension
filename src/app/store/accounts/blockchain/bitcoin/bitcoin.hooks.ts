import { getTaprootAddress } from '@shared/crypto/bitcoin/bitcoin.utils';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentNativeSegwitAccount } from './native-segwit-account.hooks';
import { useCurrentTaprootAccount } from './taproot-account.hooks';

// Checks for both TR and NativeSegwit hooks
export function useHasCurrentBitcoinAccount() {
  const nativeSegwit = useCurrentNativeSegwitAccount();
  const taproot = useCurrentTaprootAccount();
  return !!nativeSegwit && !!taproot;
}

// Temporary - remove with privacy mode
export function useZeroIndexTaprootAddress(accIndex?: number) {
  const network = useCurrentNetwork();
  const currentAccountIndex = useCurrentAccountIndex();
  const account = useTaprootAccount(accIndex ?? currentAccountIndex);

  if (!account) throw new Error('Expected keychain to be provided');

  const address = getTaprootAddress({
    index: 0,
    keychain: account.keychain,
    network: network.chain.bitcoin.network,
  });

  return address;
}
