import { isFunction } from '@leather-wallet/utils';

import { FormErrorMessages } from '@shared/error-messages';
import { Money } from '@shared/models/money.model';

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
  const isAmountLessThanZero = sum.amount.lt(0);

  const formattedAmount = isFunction(formatterFn) ? formatterFn(sum) : sum.amount.toString(10);

  return `${FormErrorMessages.InsufficientBalance} ${
    isAmountLessThanZero ? '0' : formattedAmount
  } ${sum.symbol}`;
}
