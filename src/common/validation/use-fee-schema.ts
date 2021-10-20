import { useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { stxToMicroStx } from '@stacks/ui-utils';

import { STX_DECIMALS } from '@common/constants';
import { stxAmountSchema } from '@common/validation/currency-schema';
import { formatInsufficientBalanceError, formatPrecisionError } from '@common/error-formatters';
import { SendFormErrorMessages } from '@common/error-messages';
import { isNumber } from '@common/utils';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';

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
          test(txFeeInput: unknown) {
            if (!availableStxBalance || !isNumber(txFeeInput)) return false;
            const fee = stxToMicroStx(txFeeInput);
            return availableStxBalance.isGreaterThanOrEqualTo(fee);
          },
        })
        .test((txFeeInput: unknown, context) => {
          if (!availableStxBalance || !isNumber(txFeeInput)) return false;
          // Don't test when value is undefined
          const fee = stxToMicroStx(txFeeInput);
          if (amountToSend === undefined) return true;
          const amountWithFee = new BigNumber(amountToSend).plus(fee);
          if (amountWithFee.isGreaterThan(availableStxBalance)) {
            return context.createError({
              message: SendFormErrorMessages.AdjustedFeeExceedsBalance,
            });
          }
          return true;
        }),
    [amountToSend, availableStxBalance]
  );
};
