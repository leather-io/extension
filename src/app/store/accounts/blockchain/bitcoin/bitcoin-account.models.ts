interface SoftwareBitcoinAccount {
  type: 'software';
  path: string;
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

export type BitcoinAccount = SoftwareBitcoinAccount | HardwareBitcoinAccount;
