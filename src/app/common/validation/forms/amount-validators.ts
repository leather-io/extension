import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import type { Money } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';
import {
  btcToSat,
  convertAmountToBaseUnit,
  countDecimals,
  isNumber,
  microStxToStx,
  satToBtc,
  stxToMicroStx,
} from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { FormErrorMessages } from '../../../../shared/error-messages';
import { formatInsufficientBalanceError, formatPrecisionError } from '../../error-formatters';
import { currencyAmountValidator, stxAmountPrecisionValidator } from './currency-validators';

const minSpendAmountInSats = 546;

function amountValidator() {
  return yup
    .number()
    .required(FormErrorMessages.AmountRequired)
    .positive(FormErrorMessages.MustBePositive)
    .typeError('Amount must be a number');
}

interface BtcInsufficientBalanceValidatorArgs {
  calcMaxSpend(
    recipient: string,
    utxos: UtxoResponseItem[]
  ): {
    spendableBitcoin: BigNumber;
  };
  recipient: string;
  utxos: UtxoResponseItem[];
}
export function btcInsufficientBalanceValidator({
  calcMaxSpend,
  recipient,
  utxos,
}: BtcInsufficientBalanceValidatorArgs) {
  return yup
    .number()
    .typeError(FormErrorMessages.MustBeNumber)
    .test({
      message: FormErrorMessages.InsufficientFunds,
      test(value) {
        if (!value) return false;
        const maxSpend = calcMaxSpend(recipient, utxos);
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
    .typeError(FormErrorMessages.MustBeNumber)
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

export function stxAmountValidator(availableStxBalance: Money) {
  return yup
    .number()
    .typeError(FormErrorMessages.MustBeNumber)
    .concat(currencyAmountValidator())
    .concat(stxAmountPrecisionValidator(formatPrecisionError(availableStxBalance)));
}

export function stxAvailableBalanceValidator(availableBalance: Money) {
  return yup
    .number()
    .typeError(FormErrorMessages.MustBeNumber)
    .test({
      message: formatInsufficientBalanceError(availableBalance, sum =>
        microStxToStx(sum.amount).toString()
      ),
      test(value: unknown) {
        const fee = new BigNumber(stxToMicroStx(this.parent.fee));
        if (!fee.isFinite()) {
          void analytics.track('unable_to_read_fee_in_stx_validator');
          return this.createError({ message: 'Unable to read current fee' });
        }
        if (!isNumber(value)) return false;
        if (!availableBalance) {
          void analytics.track('unable_to_read_available_balance_in_stx_validator');
          return this.createError({ message: 'Available balance unknown' });
        }
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
        return new BigNumber(value).isLessThanOrEqualTo(convertAmountToBaseUnit(amount, decimals));
      },
    });
}
