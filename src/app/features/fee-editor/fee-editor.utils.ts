import type { MarketData } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  capitalize,
  createMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
} from '@leather.io/utils';

import type { EditorFee } from './fee-editor.context';

interface FormatEditorFeeItemArgs {
  editorFee: EditorFee;
  marketData: MarketData;
}
export function formatEditorFeeItem({ editorFee, marketData }: FormatEditorFeeItemArgs) {
  const { type, feeRate, feeValue, time } = editorFee;

  return {
    titleLeft: capitalize(type),
    captionLeft: time,
    titleRight: feeValue ? formatMoneyPadded(feeValue) : 'N/A',
    captionRight: feeValue
      ? `${feeRate} ${feeValue.symbol === 'BTC' ? 'sats' : 'uSTX'}/vB · ${i18nFormatCurrency(
          baseCurrencyAmountInQuote(
            createMoney(Math.ceil(feeValue.amount.toNumber()), feeValue.symbol),
            marketData
          )
        )}`
      : 'N/A',
  };
}
