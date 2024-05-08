import { useState } from 'react';

import { Money, createMoney } from '@shared/models/money.model';

import { subtractMoney, sumMoney } from '@app/common/money/calculate-money';
import { useCurrentNativeSegwitAvailableBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';

export function useValidateBitcoinSpend(amount?: Money, isSendingMax?: boolean) {
  const [showInsufficientBalanceError, setShowInsufficientBalanceError] = useState(false);
  const { balance } = useCurrentNativeSegwitAvailableBalance();

  return {
    showInsufficientBalanceError,
    onValidateBitcoinFeeSpend(feeValue: number) {
      const feeAsMoney = createMoney(feeValue, 'BTC');

      if (feeAsMoney.amount.isGreaterThan(balance.amount)) {
        setShowInsufficientBalanceError(true);
        return false;
      }
      return true;
    },
    onValidateBitcoinAmountSpend(feeValue: number) {
      const feeAsMoney = createMoney(feeValue, 'BTC');

      if (!amount) {
        throw new Error('Amount should be defined to validate total spend');
      }

      const totalSpend = isSendingMax
        ? subtractMoney(balance, feeAsMoney)
        : sumMoney([amount, feeAsMoney]);

      if (totalSpend.amount.isGreaterThan(balance.amount)) {
        setShowInsufficientBalanceError(true);
        return false;
      }

      return true;
    },
  };
}
