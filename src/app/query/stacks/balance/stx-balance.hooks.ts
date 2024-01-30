import BigNumber from 'bignumber.js';

import {
  AccountBalanceStxKeys,
  AccountStxBalanceBigNumber,
  AddressBalanceResponse,
} from '@shared/models/account.model';
import { Money, createMoney } from '@shared/models/money.model';

import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { accountBalanceStxKeys } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { useStacksAccountBalanceQuery } from './stx-balance.query';

export function parseBalanceResponse(balances: AddressBalanceResponse) {
  const stxMoney = Object.fromEntries(
    accountBalanceStxKeys.map(key => [
      key,
      { amount: new BigNumber(balances.stx[key]), symbol: 'STX' },
    ])
  ) as Record<AccountBalanceStxKeys, Money>;

  const stx: AccountStxBalanceBigNumber & { unlockedStx: Money } = {
    ...balances.stx,
    ...stxMoney,
    balance: createMoney(stxMoney.balance.amount, 'STX'),
    locked: createMoney(stxMoney.locked.amount, 'STX'),
    unlockedStx: createMoney(stxMoney.balance.amount.minus(stxMoney.locked.amount), 'STX'),
  };
  return { ...balances, stx };
}

export function useStacksAccountBalances(address: string) {
  return useStacksAccountBalanceQuery(address, {
    select: resp => parseBalanceResponse(resp),
  });
}

export function useCurrentStacksAccountBalances() {
  const account = useCurrentStacksAccount();
  return useStacksAccountBalances(account?.address ?? '');
}
