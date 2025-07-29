import BigNumber from 'bignumber.js';

import type { Money, StxBalance } from '@leather.io/models';
import type { HiroStxAddressBalanceResponse } from '@leather.io/query';
import { createMoney, subtractMoney, sumMoney } from '@leather.io/utils';

const accountBalanceStxKeys = ['balance', 'locked'] as const;
type AccountBalanceStxKeys = (typeof accountBalanceStxKeys)[number];

export function createStxMoney(resp: HiroStxAddressBalanceResponse) {
  return Object.fromEntries(
    accountBalanceStxKeys.map(key => [key, { amount: new BigNumber(resp[key]), symbol: 'STX' }])
  ) as Record<AccountBalanceStxKeys, Money>;
}

export function createStxCryptoAssetBalance(
  stxMoney: Record<AccountBalanceStxKeys, Money>,
  inboundBalance: Money,
  outboundBalance: Money
): StxBalance {
  const totalBalance = createMoney(stxMoney.balance.amount, 'STX');
  const unlockedBalance = subtractMoney(stxMoney.balance, stxMoney.locked);

  return {
    availableBalance: subtractMoney(totalBalance, outboundBalance),
    availableUnlockedBalance: subtractMoney(unlockedBalance, outboundBalance),
    inboundBalance,
    lockedBalance: createMoney(stxMoney.locked.amount, 'STX'),
    outboundBalance,
    pendingBalance: subtractMoney(sumMoney([totalBalance, inboundBalance]), outboundBalance),
    totalBalance,
    unlockedBalance,
  };
}
