import { type Money, createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { useConvertAlexSdkCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { unitToFractionalUnit } from '@app/common/money/unit-conversion';

export function useAlexSdkAmountAsFiat(balance?: Money, price?: Money, value?: string) {
  const convertAlexSdkCurrencyToUsd = useConvertAlexSdkCurrencyToFiatAmount(
    balance?.symbol ?? '',
    price ?? createMoney(0, 'USD')
  );

  if (isUndefined(balance) || isUndefined(price) || isUndefined(value)) return;

  const convertedAmountAsMoney = convertAlexSdkCurrencyToUsd(
    createMoney(unitToFractionalUnit(balance.decimals)(value), balance.symbol, balance.decimals)
  );

  if (convertedAmountAsMoney.amount.isNaN()) return;
  return i18nFormatCurrency(convertedAmountAsMoney);
}

export function useAlexSdkBalanceAsFiat(balance: Money, price?: Money | null) {
  const convertAlexSdkCurrencyToUsd = useConvertAlexSdkCurrencyToFiatAmount(
    balance.symbol,
    price ?? createMoney(0, 'USD')
  );

  if (isUndefined(balance) || isUndefined(price)) return;

  const convertedBalanceAsMoney = convertAlexSdkCurrencyToUsd(
    createMoney(balance.amount, balance.symbol, balance.decimals)
  );

  if (convertedBalanceAsMoney.amount.isNaN() || convertedBalanceAsMoney.amount.isEqualTo(0)) return;
  return i18nFormatCurrency(convertedBalanceAsMoney);
}
