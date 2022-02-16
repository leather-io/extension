import { AccountBalanceStxKeys } from '@shared/models/account-types';
import { Account } from '@stacks/wallet-sdk';

// Extending the `Account` type from `@stacks/wallet-sdk`
export type SoftwareWalletAccountWithAddress = Account & {
  type: 'software';
  address: string;
  stxPublicKey: string;
  dataPublicKey: string;
};

export interface LedgerAccountWithAddress {
  type: 'ledger';
  address: string;
  index: number;
  stxPublicKey: string;
  // dataPublicKey: string;
}

export type AccountWithAddress = SoftwareWalletAccountWithAddress | LedgerAccountWithAddress;

export const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];
