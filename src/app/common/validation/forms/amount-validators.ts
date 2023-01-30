import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { Money } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { microStxToStx, stxToMicroStx } from '@app/common/money/unit-conversion';

import { formatInsufficientBalanceError, formatPrecisionError } from '../../error-formatters';
import { FormErrorMessages } from '../../error-messages';
import { countDecimals } from '../../utils';
import { stxCurrencyAmountValidator } from './currency-validators';

function amountValidator() {
  return yup.number().required().positive(FormErrorMessages.MustNotBeZero);
}

export function stxAmountValidator(availableBalance: Money) {
  return stxCurrencyAmountValidator(formatPrecisionError(availableBalance)).test({
    message: formatInsufficientBalanceError(availableBalance, sum =>
      microStxToStx(sum.amount).toString()
    ),
    test(value: unknown) {
      const fee = stxToMicroStx(this.parent.fee);
      if (!availableBalance || !isNumber(value)) return false;
      const availableBalanceLessFee = availableBalance.amount.minus(fee);
      return availableBalanceLessFee.isGreaterThanOrEqualTo(stxToMicroStx(value));
    },
  });
}

export function stacksFungibleTokenAmountValidator(balance: Money) {
  const { amount, decimals } = balance;
  return amountValidator()
    .test((value, context) => {
      if (!isNumber(value)) return false;
      if (!decimals && countDecimals(value) > 0)
        return context.createError({
          message: FormErrorMessages.DoesNotSupportDecimals,
        });
      if (countDecimals(value) > decimals) {
        return context.createError({ message: formatPrecisionError(balance) });
      }
      return true;
    })
    .test({
      message: formatInsufficientBalanceError(balance, sum => microStxToStx(sum.amount).toString()),
      test(value) {
        if (!isNumber(value) || !amount) return false;
        return new BigNumber(value).isLessThanOrEqualTo(amount);
      },
    });
}
