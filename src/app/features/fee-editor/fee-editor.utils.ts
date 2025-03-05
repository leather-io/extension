import type { CryptoCurrency, MarketData } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  capitalize,
  createMoney,
  formatMoney,
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
  const { priority, feeRate, txFee, time } = fee;
  const showFeeRate = feeType === 'fee-rate';
  const formattedMoneyPadded = txFee?.symbol === 'BTC' && formatMoneyPadded(txFee);
  const formattedMoney = txFee ? formatMoney(txFee) : 'N/A';

  return {
    titleLeft: capitalize(priority),
    captionLeft: time,
    titleRight: formattedMoneyPadded || formattedMoney,
    captionRight:
      showFeeRate && txFee
        ? `${feeRate} ${feeSymbolToFractionalUnitMap[txFee.symbol]}/vB · ${i18nFormatCurrency(
            baseCurrencyAmountInQuote(
              createMoney(Math.ceil(txFee.amount.toNumber()), txFee.symbol),
              marketData
            )
          )}`
        : null,
  };
}
