import type { CryptoCurrency, MarketData } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  capitalize,
  createMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
} from '@leather.io/utils';

import type { Fee, FeeType } from './fee-editor.context';

const feeSymbolToFractionalUnitMap: Record<CryptoCurrency, string> = {
  BTC: 'sats',
  STX: 'uSTX',
};

interface FormatFeeItemArgs {
  fee: Fee;
  feeType: FeeType;
  marketData: MarketData;
}
export function formatFeeItem({ fee, feeType, marketData }: FormatFeeItemArgs) {
  const { priority, feeRate, feeValue, time } = fee;

  return {
    titleLeft: capitalize(priority),
    captionLeft: time,
    titleRight: feeValue ? formatMoneyPadded(feeValue) : null,
    captionRight:
      feeType === 'fee-rate' && feeValue
        ? `${feeRate} ${feeSymbolToFractionalUnitMap[feeValue.symbol]}/vB · ${i18nFormatCurrency(
            baseCurrencyAmountInQuote(
              createMoney(Math.ceil(feeValue.amount.toNumber()), feeValue.symbol),
              marketData
            )
          )}`
        : null,
  };
}
