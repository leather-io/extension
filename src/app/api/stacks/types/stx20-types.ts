import type { Money } from '@shared/models/money.model';

/* API RESPONSE TYPES */
export interface Stx20Balance {
  ticker: string;
  balance: string;
  updateDate: string;
}

export interface Stx20BalanceResponse {
  address: string;
  balances: Stx20Balance[];
}

/* LEATHER TYPES */
export interface Stx20Token extends Omit<Stx20Balance, 'balance'> {
  balance: Money;
  marketData: null;
}
