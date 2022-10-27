import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import {
  AccountBalanceStxKeys,
  AccountStxBalanceBigNumber,
  AddressBalanceResponse,
} from '@shared/models/account.model';
import { Money, createMoney } from '@shared/models/money.model';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { AccountWithAddress, accountBalanceStxKeys } from '@app/store/accounts/account.models';

import {
  useGetAccountBalanceQuery,
  useGetAnchoredAccountBalanceListQuery,
  useGetAnchoredAccountBalanceQuery,
} from './balance.query';

function initAmountsAsMoney(balances: AddressBalanceResponse) {
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
    select: initAmountsAsMoney,
  });
}
export function useCurrentAccountUnanchoredBalances() {
  const account = useCurrentAccount();
  return useAccountUnanchoredBalances(account?.address ?? '');
}

export function useBaseAssetsUnanchored() {
  const account = useCurrentAccount();
  return useGetAccountBalanceQuery(account?.address ?? '', {
    select: resp => transformAssets(initAmountsAsMoney(resp)),
  });
}

export function useCurrentAccountAnchoredBalances() {
  const account = useCurrentAccount();
  return useGetAnchoredAccountBalanceQuery(account?.address ?? '', {
    select: resp => initAmountsAsMoney(resp),
  });
}

export function useAddressAnchoredAvailableStxBalance(address: string) {
  return useGetAnchoredAccountBalanceQuery(address, {
    select: resp => {
      const parsedResp = initAmountsAsMoney(resp);
      return parsedResp.stx.balance.amount.minus(parsedResp.stx.locked.amount);
    },
    suspense: false,
  });
}

export function useCurrentAccountAvailableStxBalance() {
  const account = useCurrentAccount();
  return useAddressAnchoredAvailableStxBalance(account?.address || '');
}

export function useAllAccountsAvailableStxBalance(accounts?: AccountWithAddress[]) {
  const accountsBalances = useGetAnchoredAccountBalanceListQuery(accounts);
  return useMemo(() => {
    return accountsBalances.reduce(
      (acc, balance) => acc.plus(balance.data?.stx.balance || 0),
      new BigNumber(0)
    );
  }, [accountsBalances]);
}
