import { useState } from 'react';

import type { Money } from '@leather.io/models';
import { createMoney, subtractMoney, sumMoney } from '@leather.io/utils';

import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

export function useValidateBitcoinSpend(amount?: Money, isSendingMax?: boolean) {
  const [showInsufficientBalanceError, setShowInsufficientBalanceError] = useState(false);
  const { balance } = useCurrentBtcCryptoAssetBalanceNativeSegwit();

  return {
    showInsufficientBalanceError,
    onValidateBitcoinFeeSpend(feeValue: number) {
      const feeAsMoney = createMoney(feeValue, 'BTC');

      if (feeAsMoney.amount.isGreaterThan(balance.availableBalance.amount)) {
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
        ? subtractMoney(balance.availableBalance, feeAsMoney)
        : sumMoney([amount, feeAsMoney]);

      if (totalSpend.amount.isGreaterThan(balance.availableBalance.amount)) {
        setShowInsufficientBalanceError(true);
        return false;
      }

      return true;
    },
  };
}
