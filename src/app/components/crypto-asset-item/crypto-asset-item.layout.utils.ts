import type { Money } from '@leather.io/models';

import { formatCurrency } from '@app/common/currency-formatter';

export function parseCryptoAssetBalance(availableBalance: Money) {
  const availableBalanceString = formatCurrency(availableBalance, {
    showCurrency: false,
    compactThreshold: Infinity,
  });
  const formattedBalance = {
    isCompact: availableBalance.amount
      .shiftedBy(-availableBalance.decimals)
      .isGreaterThan(1_000_000),
    value: formatCurrency(availableBalance, { preset: 'shorthand-balance' }),
  };

  return {
    availableBalanceString,
    formattedBalance,
  };
}
