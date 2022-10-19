import * as yup from 'yup';

import { STX_DECIMALS } from '@shared/constants';
import { countDecimals } from '@app/common/utils';
import { isNumber } from '@shared/utils';

function curencyAmountSchema() {
  return yup.number().positive('Amount must be positive').typeError('Currency be a number');
}

export function stxAmountSchema(errorMsg: string) {
  return curencyAmountSchema()
    .required('Enter an amount of STX')
    .typeError('Amount of STX must be a number')
    .test({
      message: errorMsg,
      test(value: unknown) {
        if (!isNumber(value)) return false;
        return countDecimals(value) <= STX_DECIMALS;
      },
    });
}
