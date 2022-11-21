import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { STX_DECIMALS } from '@shared/constants';
import { isNumber } from '@shared/utils';

import { formatInsufficientBalanceError, formatPrecisionError } from '@app/common/error-formatters';
import { SendFormErrorMessages } from '@app/common/error-messages';
import { stxAmountSchema } from '@app/common/validation/currency-schema';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';

import { stxToMicroStx } from '../money/unit-conversion';

/**
 * @param amountToSend stx amount in µSTX
 */
export const useFeeSchema = (amountToSend?: number) => {
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();

  return useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS))
        .test({
          message: formatInsufficientBalanceError(balances?.stx.availableStx.amount, 'STX'),
          test(fee: unknown) {
            if (!balances?.stx.availableStx.amount || !isNumber(fee)) return false;
            return balances?.stx.availableStx.amount.isGreaterThanOrEqualTo(stxToMicroStx(fee));
          },
        })
        .test((fee: unknown, context) => {
          if (!balances?.stx.availableStx.amount || !isNumber(fee)) return false;
          // Don't test when value is undefined
          if (amountToSend === undefined) return true;
          const amountWithFee = new BigNumber(amountToSend).plus(stxToMicroStx(fee));
          if (amountWithFee.isGreaterThan(balances?.stx.availableStx.amount)) {
            return context.createError({
              message: SendFormErrorMessages.AdjustedFeeExceedsBalance,
            });
          }
          return true;
        }),
    [amountToSend, balances?.stx.availableStx.amount]
  );
};
