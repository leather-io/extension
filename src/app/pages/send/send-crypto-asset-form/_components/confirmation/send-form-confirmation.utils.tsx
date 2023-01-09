import BigNumber from 'bignumber.js';

import { NumType, createMoney } from '@shared/models/money.model';

export function convertToMoneyTypeWithDefaultOfZero(
  symbol: string,
  num?: NumType,
  decimals?: number
) {
  return createMoney(new BigNumber(num ?? 0), symbol.toUpperCase(), decimals);
}
