import type { Money } from '@leather.io/models';
import { createMoney, isFunction } from '@leather.io/utils';

import { FormErrorMessages } from '@shared/error-messages';

export function formatPrecisionError(num?: Money) {
  if (!num) return FormErrorMessages.CannotDeterminePrecision;
  const error = FormErrorMessages.TooMuchPrecision;
  return error.replace('{decimals}', String(num.decimals));
}

export function formatInsufficientBalanceError(
  sum?: Money,
  formatterFn?: (amount: Money) => string
) {
  if (!sum) return FormErrorMessages.CannotDetermineBalance;

  const normalizedSum = sum.amount.isLessThan(0) ? createMoney(0, sum.symbol, sum.decimals) : sum;
  const formattedAmount = isFunction(formatterFn)
    ? formatterFn(normalizedSum)
    : normalizedSum.amount.toString(10);

  return `${FormErrorMessages.InsufficientBalance} ${formattedAmount}`;
}
