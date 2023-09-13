import { useEffect, useState } from 'react';

import { useField } from 'formik';
import { styled } from 'leather-styles/jsx';

import { MarketData } from '@shared/models/market.model';
import { Money, createMoneyFromDecimal } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';

interface SendFiatInputProps {
  marketData: MarketData;
  assetSymbol?: string;
}

export function SendFiatValue({ marketData, assetSymbol = '' }: SendFiatInputProps) {
  const [field] = useField('amount');
  const [assetValue, setAssetValue] = useState<Money>(createMoneyFromDecimal(0, assetSymbol));

  useEffect(() => {
    let amount = Number(field.value);

    if (isNaN(amount) || !isNumber(amount) || amount < 0) {
      amount = 0;
    }

    const assetAmount = createMoneyFromDecimal(amount, assetSymbol);
    setAssetValue(assetAmount);
  }, [field.value, assetSymbol]);

  return (
    <styled.span textStyle="body.02" color="accent.text-subdued">
      {Number(field.value) > 0 && '~'}{' '}
      {i18nFormatCurrency(baseCurrencyAmountInQuote(assetValue, marketData))} USD
    </styled.span>
  );
}
