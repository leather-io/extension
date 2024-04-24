import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import type { Money } from './money.model';

type SelectedKeys =
  | 'balance'
  | 'total_sent'
  | 'total_received'
  | 'total_fees_sent'
  | 'total_miner_rewards_received'
  | 'locked';

export type AccountBalanceStxKeys = keyof Pick<AddressBalanceResponse['stx'], SelectedKeys>;

export interface AccountStxBalanceBigNumber
  extends Omit<AddressBalanceResponse['stx'], AccountBalanceStxKeys> {
  balance: Money;
  total_sent: Money;
  total_received: Money;
  total_fees_sent: Money;
  total_miner_rewards_received: Money;
  locked: Money;
}

export interface AccountBalanceResponseBigNumber extends Omit<AddressBalanceResponse, 'stx'> {
  stx: AccountStxBalanceBigNumber;
}
