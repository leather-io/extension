import type { Account } from '@stacks/wallet-sdk';

// Extending the `Account` type from `@stacks/wallet-sdk`
export type SoftwareStacksAccount = Account & {
  type: 'software';
  index: number;
  address: string;
  stxPublicKey: string;
  dataPublicKey: string;
};

export interface HardwareStacksAccount {
  type: 'ledger';
  index: number;
  address: string;
  stxPublicKey: string;
  dataPublicKey: string;
}

export type StacksAccount = SoftwareStacksAccount | HardwareStacksAccount;
