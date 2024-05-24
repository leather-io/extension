import { isObject } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';

import { Money } from '@shared/models/money.model';

export function isMoney(val: unknown): val is Money {
  if (!isObject(val)) return false;
  return 'amount' in val && 'symbol' in val && 'decimals' in val;
}

export function isMoneyGreaterThanZero(money: Money) {
  if (!BigNumber.isBigNumber(money.amount)) return;
  return !(money.amount.isNaN() || money.amount.isZero());
}
