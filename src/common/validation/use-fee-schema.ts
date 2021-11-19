import { useCallback } from 'react';
import BigNumber from 'bignumber.js';

import { STX_DECIMALS } from '@common/constants';
import { stxAmountSchema } from '@common/validation/currency-schema';
import { formatInsufficientBalanceError, formatPrecisionError } from '@common/error-formatters';
import { SendFormErrorMessages } from '@common/error-messages';
import { isNumber } from '@common/utils';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { stxToMicroStx } from '@common/stacks-utils';

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
          test(fee: unknown) {
            if (!availableStxBalance || !isNumber(fee)) return false;
            return availableStxBalance.isGreaterThanOrEqualTo(stxToMicroStx(fee));
          },
        })
        .test((fee: unknown, context) => {
          if (!availableStxBalance || !isNumber(fee)) return false;
          // Don't test when value is undefined
          if (amountToSend === undefined) return true;
          const amountWithFee = new BigNumber(amountToSend).plus(stxToMicroStx(fee));
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
