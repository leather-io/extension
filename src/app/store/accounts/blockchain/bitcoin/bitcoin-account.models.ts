import { HDKey } from '@scure/bip32';

import { DerivationPathDepth } from '@shared/crypto/derivation-path.utils';

interface SoftwareBitcoinAccount {
  type: 'software';
  xpub: string;
  index: number;
  keychain: HDKey;
}

// TODO: complete with bitcoin ledger support
interface HardwareBitcoinAccount {
  type: 'ledger';
  path: string;
  index: number;
  xpub: string;
}

// ts-unused-exports:disable-next-line
export type BitcoinAccount = SoftwareBitcoinAccount | HardwareBitcoinAccount;

export const tempHardwareAccountForTesting: HardwareBitcoinAccount = {
  type: 'ledger',
  index: 0,
  path: '',
  xpub: '',
};

export function formatBitcoinAccount(keychain: HDKey) {
  if (keychain.depth !== DerivationPathDepth.Account)
    throw new Error('Can only format from account keychain');
  return (index: number): SoftwareBitcoinAccount => ({
    type: 'software',
    index,
    // The rationate for wrapping the keychain is so we pass around the xpub
    // rather than the private-key containing HDKey
    xpub: keychain.publicExtendedKey,
    keychain: HDKey.fromExtendedKey(keychain.publicExtendedKey),
  });
}
