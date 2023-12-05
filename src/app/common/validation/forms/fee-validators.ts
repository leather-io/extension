import BigNumber from 'bignumber.js';
import { AnyObject, NumberSchema } from 'yup';

import { Money } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { formatInsufficientBalanceError, formatPrecisionError } from '@app/common/error-formatters';
import {
  btcAmountPrecisionValidator,
  stxAmountPrecisionValidator,
} from '@app/common/validation/forms/currency-validators';

import { btcToSat, moneyToBaseUnit, stxToMicroStx } from '../../money/unit-conversion';

interface FeeValidatorFactoryArgs {
  availableBalance?: Money;
  unitConverter(unit: string | number | BigNumber): BigNumber;
  validator(errorMsg: string): NumberSchema<number | undefined, AnyObject>;
}
function feeValidatorFactory({
  availableBalance,
  unitConverter,
  validator,
}: FeeValidatorFactoryArgs) {
  return validator(formatPrecisionError(availableBalance)).test({
    message: formatInsufficientBalanceError(availableBalance, sum =>
      moneyToBaseUnit(sum).toString()
    ),
    test(fee: unknown) {
      if (!availableBalance || !isNumber(fee)) return false;
      return availableBalance.amount.isGreaterThanOrEqualTo(unitConverter(fee));
    },
  });
}

// ts-unused-exports:disable-next-line
export function btcFeeValidator(availableBalance?: Money) {
  return feeValidatorFactory({
    availableBalance,
    unitConverter: btcToSat,
    validator: btcAmountPrecisionValidator,
  });
}

export function stxFeeValidator(availableBalance?: Money) {
  return feeValidatorFactory({
    availableBalance,
    unitConverter: stxToMicroStx,
    validator: stxAmountPrecisionValidator,
  });
}
