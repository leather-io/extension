import { Money, createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { useConvertAlexSwapCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { unitToFractionalUnit } from '@app/common/money/unit-conversion';

export function useAmountAsFiat(balance?: Money, price?: Money, value?: string) {
  const convertAlexSwapCurrencyToUsd = useConvertAlexSwapCurrencyToFiatAmount(
    balance?.symbol ?? '',
    price ?? createMoney(0, 'USD')
  );

  if (isUndefined(balance) || isUndefined(price) || isUndefined(value)) return '';

  const convertedAmountAsMoney = convertAlexSwapCurrencyToUsd(
    createMoney(unitToFractionalUnit(balance.decimals)(value), balance.symbol, balance.decimals)
  );

  return convertedAmountAsMoney.amount.isNaN() ? '' : i18nFormatCurrency(convertedAmountAsMoney);
}

export function useBalanceAsFiat(balance?: Money, price?: Money) {
  const convertAlexSwapCurrencyToUsd = useConvertAlexSwapCurrencyToFiatAmount(
    balance?.symbol ?? '',
    price ?? createMoney(0, 'USD')
  );

  if (isUndefined(balance) || isUndefined(price)) return '';

  const convertedBalanceAsMoney = convertAlexSwapCurrencyToUsd(
    createMoney(balance.amount, balance.symbol, balance.decimals)
  );

  return convertedBalanceAsMoney.amount.isNaN() ? '' : i18nFormatCurrency(convertedBalanceAsMoney);
}
