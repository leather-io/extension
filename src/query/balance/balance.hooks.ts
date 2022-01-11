import BigNumber from 'bignumber.js';

import { useGetAccountBalanceQuery } from './balance.query';
import type { AccountBalanceStxKeys, AccountStxBalanceBigNumber } from '@models/account-types';

const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];

function useAddressBalances(address: string) {
  const { data: balances } = useGetAccountBalanceQuery(address);
  if (!balances) return;

  const stxBigNumbers = Object.fromEntries(
    accountBalanceStxKeys.map(key => [key, new BigNumber(balances.stx[key])])
  ) as Record<AccountBalanceStxKeys, BigNumber>;

  const stx: AccountStxBalanceBigNumber = { ...balances.stx, ...stxBigNumbers };
  return { ...balances, stx };
}

export function useAddressAvailableStxBalance(address: string) {
  const balances = useAddressBalances(address);
  if (!balances) return new BigNumber(0);
  return balances.stx.balance.minus(balances.stx.locked);
}
