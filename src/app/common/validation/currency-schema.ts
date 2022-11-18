import * as yup from 'yup';

import { BTC_DECIMALS, STX_DECIMALS } from '@shared/constants';
import { isNumber } from '@shared/utils';

import { countDecimals } from '@app/common/utils';

function curencyAmountSchema() {
  return yup.number().positive('Amount must be positive').typeError('Currency be a number');
}

function currencyPrecisionValidatorFactory(
  symbol: string,
  precision: number,
  errorMessage: string
) {
  return curencyAmountSchema()
    .required(`Enter an amount of ${symbol}`)
    .typeError(`Amount of ${symbol} must be a number`)
    .test({
      message: errorMessage,
      test(value: unknown) {
        if (!isNumber(value)) return false;
        return countDecimals(value) <= precision;
      },
    });
}

export function stxAmountSchema(errorMsg: string) {
  return currencyPrecisionValidatorFactory('STX', STX_DECIMALS, errorMsg);
}

export function btcAmountSchema(errorMsg: string) {
  return currencyPrecisionValidatorFactory('BTC', BTC_DECIMALS, errorMsg);
}
