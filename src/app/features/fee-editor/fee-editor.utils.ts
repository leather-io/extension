import {
  baseCurrencyAmountInQuote,
  capitalize,
  createMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
} from '@leather.io/utils';

import type { FormatFeeForDisplayArgs } from '@app/features/fee-editor/use-fee-editor';

import type { FeeDisplayInfo } from './fee-editor.context';

export function formatFeeForDisplay({
  rawFee,
  marketData,
}: FormatFeeForDisplayArgs): FeeDisplayInfo {
  const { type, baseUnitFeeValue, feeRate, time } = rawFee;

  return {
    feeType: type,
    feeRate: feeRate ?? 0,
    baseUnitsValue: baseUnitFeeValue ? baseUnitFeeValue.amount.toNumber() : 0,

    titleLeft: capitalize(type),
    captionLeft: time,
    titleRight: baseUnitFeeValue ? formatMoneyPadded(baseUnitFeeValue) : 'N/A',
    captionRight: baseUnitFeeValue
      ? `${feeRate} ${baseUnitFeeValue.symbol === 'BTC' ? 'sats' : 'uSTX'}/vB · ${i18nFormatCurrency(
          baseCurrencyAmountInQuote(
            createMoney(Math.ceil(baseUnitFeeValue.amount.toNumber()), baseUnitFeeValue.symbol),
            marketData
          )
        )}`
      : 'N/A',
  };
}
