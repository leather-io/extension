import BigNumber from 'bignumber.js';

import { NumType, createMoney } from '@shared/models/money.model';
import { isBigInt } from '@shared/utils';

export function convertToMoneyTypeWithDefaultOfZero(
  symbol: string,
  num?: NumType,
  decimals?: number
) {
  return createMoney(
    isBigInt(num) ? new BigNumber(num.toString()) : new BigNumber(num ?? 0),
    symbol.toUpperCase(),
    decimals
  );
}
