export interface SoftwareBitcoinAccount {
  type: 'software';
  xpub: string;
  index: number;
}

// TODO: complete with bitcoin ledger support
export interface HardwareBitcoinAccount {
  type: 'ledger';
  path: string;
  index: number;
  xpub: string;
}

// ts-unused-exports:disable-next-line
export type BitcoinAccount = SoftwareBitcoinAccount | HardwareBitcoinAccount;
