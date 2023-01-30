import type { Account } from '@stacks/wallet-sdk';

import type { AccountBalanceStxKeys } from '@shared/models/account.model';

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

export const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];
