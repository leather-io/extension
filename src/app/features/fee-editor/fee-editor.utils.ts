import type { CryptoCurrency, MarketData } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  capitalize,
  createMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
} from '@leather.io/utils';

import type { Fee } from './fee-editor.context';

const feeSymbolToFractionalUnitMap: Record<CryptoCurrency, string> = {
  BTC: 'sats',
  STX: 'uSTX',
};

interface FormatFeeItemArgs {
  fee: Fee;
  marketData: MarketData;
}
export function formatFeeItem({ fee, marketData }: FormatFeeItemArgs) {
  const { type, feeRate, feeValue, time } = fee;

  return {
    titleLeft: capitalize(type),
    captionLeft: time,
    titleRight: feeValue ? formatMoneyPadded(feeValue) : 'N/A',
    captionRight: feeValue
      ? `${feeRate} ${feeSymbolToFractionalUnitMap[feeValue.symbol]}/vB · ${i18nFormatCurrency(
          baseCurrencyAmountInQuote(
            createMoney(Math.ceil(feeValue.amount.toNumber()), feeValue.symbol),
            marketData
          )
        )}`
      : 'N/A',
  };
}
