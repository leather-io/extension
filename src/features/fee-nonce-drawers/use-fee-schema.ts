import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { useCallback } from 'react';
import { stxAmountSchema } from '@common/validation/currency-schema';
import { formatInsufficientBalanceError, formatPrecisionError } from '@common/error-formatters';
import { STX_DECIMALS } from '@common/constants';
import { isNumber } from '@common/utils';
import BigNumber from 'bignumber.js';

/**
 * @param amountToSend stx amount in µSTX
 */
export const useFeeSchema = (amountToSend?: number) => {
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  return useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS)).test({
        message: formatInsufficientBalanceError(availableStxBalance, 'STX'),
        test(fee: unknown) {
          if (!availableStxBalance || !isNumber(fee)) return false;
          const availableBalanceLessFee = availableStxBalance.minus(fee);
          const hasEnoughStx = availableBalanceLessFee.isGreaterThanOrEqualTo(fee);
          if (!hasEnoughStx) return false;
          if (amountToSend) {
            const amountWithFee = new BigNumber(amountToSend).plus(fee);
            return amountWithFee.isLessThanOrEqualTo(availableStxBalance);
          }
          return true;
        },
      }),
    [availableStxBalance, amountToSend]
  );
};
