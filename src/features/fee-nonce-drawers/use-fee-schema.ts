import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { useCallback } from 'react';
import { stxAmountSchema } from '@common/validation/currency-schema';
import { formatInsufficientBalanceError, formatPrecisionError } from '@common/error-formatters';
import { STX_DECIMALS } from '@common/constants';
import { isNumber } from '@common/utils';
import BigNumber from 'bignumber.js';
import { stxToMicroStx } from '@stacks/ui-utils';
import { SendFormErrorMessages } from '@common/error-messages';

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
            return availableStxBalance.isGreaterThanOrEqualTo(fee);
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
              message: SendFormErrorMessages.AdjustedFeeExceedsBalance,
            });
          }
          return true;
        }),
    [availableStxBalance, amountToSend]
  );
};
