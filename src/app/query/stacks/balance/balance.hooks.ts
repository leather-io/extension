import BigNumber from 'bignumber.js';

import {
  AccountBalanceStxKeys,
  AccountStxBalanceBigNumber,
  AddressBalanceResponse,
} from '@shared/models/account.model';
import { Money, createMoney } from '@shared/models/money.model';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { accountBalanceStxKeys } from '@app/store/accounts/account.models';

import {
  useAnchoredStacksAccountBalanceQuery,
  useUnanchoredStacksAccountBalanceQuery,
} from './balance.query';

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

function useUnanchoredStacksBalances(address: string) {
  return useUnanchoredStacksAccountBalanceQuery(address, {
    select: resp => parseBalanceResponse(resp),
  });
}

export function useCurrentStacksAccountUnanchoredBalances() {
  const account = useCurrentAccount();
  return useUnanchoredStacksBalances(account?.address ?? '');
}

export function useAnchoredStacksAccountBalances(address: string) {
  return useAnchoredStacksAccountBalanceQuery(address, {
    select: resp => parseBalanceResponse(resp),
  });
}

export function useCurrentStacksAccountAnchoredBalances() {
  const account = useCurrentAccount();
  return useAnchoredStacksAccountBalances(account?.address ?? '');
}
