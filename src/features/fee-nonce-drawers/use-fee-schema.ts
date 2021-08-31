import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { useCallback } from 'react';
import { stxAmountSchema } from '@common/validation/currency-schema';
import { formatInsufficientBalanceError, formatPrecisionError } from '@common/error-formatters';
import { STX_DECIMALS } from '@common/constants';
import { isNumber } from '@common/utils';

export const useFeeSchema = () => {
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  return useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS)).test({
        message: formatInsufficientBalanceError(availableStxBalance, 'STX'),
        test(fee: unknown) {
          if (!availableStxBalance || !isNumber(fee)) return false;
          const availableBalanceLessFee = availableStxBalance.minus(fee);
          return availableBalanceLessFee.isGreaterThanOrEqualTo(fee);
        },
      }),
    [availableStxBalance]
  );
};
