import BigNumber from 'bignumber.js';

import { SendFormErrorMessages } from '@app/common/error-messages';
import { initBigNumber } from '@app/common/utils';

import { microStxToStx } from './money/unit-conversion';

export function formatPrecisionError(symbol: string, decimals: number) {
  const error = SendFormErrorMessages.TooMuchPrecision;
  return error.replace('{token}', symbol).replace('{decimals}', String(decimals));
}

export function formatInsufficientBalanceError(
  availableBalance?: BigNumber | string,
  symbol?: string
) {
  if (!availableBalance || !symbol) return;
  const isStx = symbol === 'STX';
  const amount = initBigNumber(availableBalance);
  const formattedAmount = isStx ? microStxToStx(amount).toString() : amount.toString(10);
  return `${SendFormErrorMessages.InsufficientBalance} ${
    amount.lt(0) ? '0' : formattedAmount
  } ${symbol}`;
}
