import BigNumber from 'bignumber.js';
import { RequiredNumberSchema } from 'yup/lib/number';
import { AnyObject } from 'yup/lib/object';

import { Money } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { formatInsufficientBalanceError, formatPrecisionError } from '@app/common/error-formatters';
import {
  btcAmountValidator,
  stxAmountValidator,
} from '@app/common/validation/forms/currency-validators';

import { btcToSat, stxToMicroStx } from '../../money/unit-conversion';

interface FeeValidatorFactoryArgs {
  availableBalance?: Money;
  unitConverter: (unit: string | number | BigNumber) => BigNumber;
  validator: (errorMsg: string) => RequiredNumberSchema<number | undefined, AnyObject>;
}
function feeValidatorFactory({
  availableBalance,
  unitConverter,
  validator,
}: FeeValidatorFactoryArgs) {
  return validator(formatPrecisionError(availableBalance)).test({
    message: formatInsufficientBalanceError(availableBalance),
    test(fee: unknown) {
      if (!availableBalance || !isNumber(fee)) return false;
      return availableBalance.amount.isGreaterThanOrEqualTo(unitConverter(fee));
    },
  });
}

export function btcFeeValidator(availableBalance?: Money) {
  return feeValidatorFactory({
    availableBalance,
    unitConverter: btcToSat,
    validator: btcAmountValidator,
  });
}

export function stxFeeValidator(availableBalance?: Money) {
  return feeValidatorFactory({
    availableBalance,
    unitConverter: stxToMicroStx,
    validator: stxAmountValidator,
  });
}
