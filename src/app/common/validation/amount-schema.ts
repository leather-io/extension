import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { Money } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { formatInsufficientBalanceError, formatPrecisionError } from '../error-formatters';
import { SendFormErrorMessages } from '../error-messages';
import { countDecimals } from '../utils';

export function makeStacksFungibleTokenSchema(balance: Money) {
  const { amount, symbol, decimals } = balance;
  return yup
    .number()
    .test((value, context) => {
      if (!isNumber(value)) return false;
      if (!decimals && countDecimals(value) > 0)
        return context.createError({
          message: SendFormErrorMessages.DoesNotSupportDecimals,
        });
      if (countDecimals(value) > decimals) {
        return context.createError({ message: formatPrecisionError(symbol, decimals) });
      }
      return true;
    })
    .test({
      message: formatInsufficientBalanceError(amount, symbol),
      test(value) {
        if (!isNumber(value) || !amount) return false;
        return new BigNumber(value).isLessThanOrEqualTo(amount);
      },
    });
}
