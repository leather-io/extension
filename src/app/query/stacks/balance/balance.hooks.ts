import BigNumber from 'bignumber.js';

import {
  AccountBalanceStxKeys,
  AccountStxBalanceBigNumber,
  AddressBalanceResponse,
} from '@shared/models/account.model';
import { Money, createMoney } from '@shared/models/money.model';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { accountBalanceStxKeys } from '@app/store/accounts/account.models';

import { useGetAccountBalanceQuery, useGetAnchoredAccountBalanceQuery } from './balance.query';

export function parseBalanceResponse(balances: AddressBalanceResponse) {
  const stxMoney = Object.fromEntries(
    accountBalanceStxKeys.map(key => [
      key,
      { amount: new BigNumber(balances.stx[key]), symbol: 'STX' },
    ])
  ) as Record<AccountBalanceStxKeys, Money>;

  const stx: AccountStxBalanceBigNumber & { availableStx: Money } = {
    ...balances.stx,
    ...stxMoney,
    availableStx: createMoney(stxMoney.balance.amount.minus(stxMoney.locked.amount), 'STX'),
  };
  return { ...balances, stx };
}

export function useAccountUnanchoredBalances(address: string) {
  return useGetAccountBalanceQuery(address, {
    select: resp => parseBalanceResponse(resp),
  });
}
export function useCurrentAccountUnanchoredBalances() {
  const account = useCurrentAccount();
  return useAccountUnanchoredBalances(account?.address ?? '');
}

export function useCurrentAccountAnchoredBalances() {
  const account = useCurrentAccount();
  return useGetAnchoredAccountBalanceQuery(account?.address ?? '', {
    select: resp => parseBalanceResponse(resp),
  });
}
