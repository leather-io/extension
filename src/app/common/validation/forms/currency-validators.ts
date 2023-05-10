import * as yup from 'yup';

import { BTC_DECIMALS, STX_DECIMALS } from '@shared/constants';
import { isNumber } from '@shared/utils';

import { FormErrorMessages } from '@app/common/error-messages';
import { countDecimals } from '@app/common/math/helpers';

export function currencyAmountValidator() {
  return yup
    .number()
    .positive(FormErrorMessages.MustBePositive)
    .typeError('Currency must be a number');
}

function currencyPrecisionValidatorFactory(precision: number, errorMessage: string) {
  return yup
    .number()
    .required(FormErrorMessages.AmountRequired)
    .typeError(FormErrorMessages.MustBeNumber)
    .test({
      message: errorMessage,
      test(value: unknown) {
        if (!isNumber(value)) return false;
        return countDecimals(value) <= precision;
      },
    });
}

export function btcAmountPrecisionValidator(errorMsg: string) {
  return currencyPrecisionValidatorFactory(BTC_DECIMALS, errorMsg);
}

export function stxAmountPrecisionValidator(errorMsg: string) {
  return currencyPrecisionValidatorFactory(STX_DECIMALS, errorMsg);
}
