import { Money, createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { unitToFractionalUnit } from '@app/common/money/unit-conversion';

export function useAmountAsFiat(balance?: Money, value?: string) {
  const convertCryptoCurrencyToUsd = useConvertCryptoCurrencyToFiatAmount(balance?.symbol ?? '');

  if (isUndefined(balance) || isUndefined(value)) return '';

  const convertedAmountAsMoney = convertCryptoCurrencyToUsd(
    createMoney(unitToFractionalUnit(balance.decimals)(value), balance.symbol, balance.decimals)
  );
  // TODO: Remove this when using live data bc amounts won't be null?
  return convertedAmountAsMoney.amount.isNaN() ? '' : i18nFormatCurrency(convertedAmountAsMoney);
}
