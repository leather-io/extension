import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { Money } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import {
  btcToSat,
  microStxToStx,
  satToBtc,
  stxToMicroStx,
} from '@app/common/money/unit-conversion';

import {
  formatErrorWithSymbol,
  formatInsufficientBalanceError,
  formatPrecisionError,
} from '../../error-formatters';
import { FormErrorMessages } from '../../error-messages';
import { countDecimals } from '../../utils';
import { currencyAmountValidator, stxAmountPrecisionValidator } from './currency-validators';

const minSpendAmountInSats = 6000;

function amountValidator() {
  return yup
    .number()
    .required()
    .positive(FormErrorMessages.MustNotBeZero)
    .typeError('Amount must be a number');
}

interface BtcInsufficientBalanceValidatorArgs {
  recipient: string;
  calcMaxSpend(recipient: string): {
    spendableBitcoin: BigNumber;
  };
}
export function btcInsufficientBalanceValidator({
  recipient,
  calcMaxSpend,
}: BtcInsufficientBalanceValidatorArgs) {
  return yup
    .number()
    .typeError(formatErrorWithSymbol('BTC', FormErrorMessages.MustBeNumber))
    .test({
      message: FormErrorMessages.InsufficientFunds,
      test(value) {
        if (!value) return false;
        const maxSpend = calcMaxSpend(recipient);
        if (!maxSpend) return false;
        const desiredSpend = new BigNumber(value);
        if (desiredSpend.isGreaterThan(maxSpend.spendableBitcoin)) return false;
        return true;
      },
    });
}

export function btcMinimumSpendValidator() {
  return yup
    .number()
    .typeError(formatErrorWithSymbol('BTC', FormErrorMessages.MustBeNumber))
    .test({
      message: `Minimum is ${satToBtc(minSpendAmountInSats)}`,
      test(value) {
        if (!value) return false;
        const desiredSpend = btcToSat(value);
        if (desiredSpend.isLessThan(minSpendAmountInSats)) return false;
        return true;
      },
    });
}

export function stxAmountValidator() {
  return yup
    .number()
    .typeError(formatErrorWithSymbol('STX', FormErrorMessages.MustBeNumber))
    .concat(currencyAmountValidator())
    .concat(stxAmountPrecisionValidator(formatPrecisionError()));
}

export function stxAvailableBalanceValidator(availableBalance: Money) {
  return yup
    .number()
    .typeError(formatErrorWithSymbol('STX', FormErrorMessages.MustBeNumber))
    .test({
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
