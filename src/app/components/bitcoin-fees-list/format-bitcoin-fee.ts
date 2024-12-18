import {
  baseCurrencyAmountInQuote,
  capitalize,
  createMoney,
  i18nFormatCurrency,
} from '@leather.io/utils';

import type { FeeDisplayInfo, FormatFeeForDisplayArgs } from '@app/common/fees/use-fees';

import { getBtcFeeValue } from './bitcoin-fees.utils';

export function formatBitcoinFeeForDisplay({
  rawFee,
  marketData,
}: FormatFeeForDisplayArgs): FeeDisplayInfo {
  function getFiatFeeValue(fee: number) {
    return i18nFormatCurrency(
      baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), marketData)
    );
  }

  const { type, baseUnitsFeeValue, feeRate, time } = rawFee;

  return {
    feeType: type,
    feeRate: feeRate ?? 0,
    baseUnitsValue: baseUnitsFeeValue ?? 0,

    titleLeft: capitalize(type),
    captionLeft: time,
    titleRight: baseUnitsFeeValue ? getBtcFeeValue(baseUnitsFeeValue) : 'N/A',
    captionRight: baseUnitsFeeValue
      ? `${feeRate} sats/vB · ${getFiatFeeValue(baseUnitsFeeValue)}`
      : 'N/A',
  };
}
