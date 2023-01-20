import type { Account } from '@stacks/wallet-sdk';

import type { AccountBalanceStxKeys } from '@shared/models/account.model';

// Extending the `Account` type from `@stacks/wallet-sdk`
export type SoftwareWalletAccount = Account & {
  type: 'software';
  address: string;
  stxPublicKey: string;
  dataPublicKey: string;
};

export interface HardwareWalletAccount {
  type: 'ledger';
  address: string;
  index: number;
  stxPublicKey: string;
  dataPublicKey: string;
}

export type WalletAccount = SoftwareWalletAccount | HardwareWalletAccount;

export const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];
