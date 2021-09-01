import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { useCallback } from 'react';
import { stxAmountSchema } from '@common/validation/currency-schema';
import { formatInsufficientBalanceError, formatPrecisionError } from '@common/error-formatters';
import { STX_DECIMALS } from '@common/constants';
import { isNumber } from '@common/utils';
import BigNumber from 'bignumber.js';
import { stxToMicroStx } from '@stacks/ui-utils';

/**
 * @param amountToSend stx amount in µSTX
 */
export const useFeeSchema = (amountToSend?: number) => {
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  return useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS))
        .test({
          message: formatInsufficientBalanceError(availableStxBalance, 'STX'),
          test(feeInput: unknown) {
            if (!availableStxBalance || !isNumber(feeInput)) return false;
            const fee = stxToMicroStx(feeInput);
            const availableBalanceLessFee = availableStxBalance.minus(fee);
            const hasEnoughStx = availableBalanceLessFee.isGreaterThanOrEqualTo(fee);
            if (!hasEnoughStx) return false;
            return true;
          },
        })
        .test((feeInput: unknown, context) => {
          if (!availableStxBalance || !isNumber(feeInput)) return false;
          // Don't test when value is undefined
          const fee = stxToMicroStx(feeInput);
          if (amountToSend === undefined) return true;
          const amountWithFee = new BigNumber(amountToSend).plus(fee);
          if (amountWithFee.isGreaterThan(availableStxBalance)) {
            return context.createError({
              message:
                'The fee added now exceeds your current STX balance. Consider lowering the amount being sent.',
            });
          }
          return true;
        }),
    [availableStxBalance, amountToSend]
  );
};
