import { Money } from '@shared/models/money.model';

import { FormErrorMessages } from '@app/common/error-messages';
import { initBigNumber } from '@app/common/utils';

import { microStxToStx, satToBtc } from './money/unit-conversion';

export function formatErrorWithSymbol(symbol: string, error: string) {
  return error.replace('{symbol}', symbol);
}

export function formatPrecisionError(num?: Money) {
  if (!num) return FormErrorMessages.CannotDeterminePrecision;
  const error = FormErrorMessages.TooMuchPrecision;
  return formatErrorWithSymbol(num.symbol, error).replace('{decimals}', String(num.decimals));
}

export function formatInsufficientBalanceError(num?: Money) {
  if (!num) return FormErrorMessages.CannotDetermineBalance;
  const amount = initBigNumber(num.amount);
  const isAmountLessThanZero = amount.lt(0);
  let formattedAmount = '';

  switch (num.symbol) {
    case 'BTC':
      formattedAmount = satToBtc(amount).toString();
      break;
    case 'STX':
      formattedAmount = microStxToStx(amount).toString();
      break;
    default:
      formattedAmount = amount.toString(10);
      break;
  }
  return `${FormErrorMessages.InsufficientBalance} ${
    isAmountLessThanZero ? '0' : formattedAmount
  } ${num.symbol}`;
}
