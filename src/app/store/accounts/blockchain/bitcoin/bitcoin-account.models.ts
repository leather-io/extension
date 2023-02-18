import { HDKey } from '@scure/bip32';

interface SoftwareBitcoinAccount {
  type: 'software';
  xpub: string;
  index: number;
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
  return (index: number): SoftwareBitcoinAccount => ({
    type: 'software',
    index,
    xpub: keychain.publicExtendedKey,
  });
}
