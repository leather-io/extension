import { Money } from '@shared/models/money.model';
import { isObject } from '@shared/utils';

export function isMoney(val: unknown): val is Money {
  if (!isObject(val)) return false;
  return 'amount' in val && 'symbol' in val && 'decimals' in val;
}
