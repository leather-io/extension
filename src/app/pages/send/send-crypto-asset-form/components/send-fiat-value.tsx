import { useEffect, useState } from 'react';

import { useField } from 'formik';
import { styled } from 'leather-styles/jsx';

import type { MarketData, Money } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  createMoneyFromDecimal,
  i18nFormatCurrency,
  isNumber,
} from '@leather.io/utils';

interface SendFiatInputProps {
  marketData: MarketData;
  assetSymbol?: string;
  assetDecimals?: number;
}

export function SendFiatValue({ marketData, assetSymbol = '', assetDecimals }: SendFiatInputProps) {
  const [field] = useField('amount');
  const [assetValue, setAssetValue] = useState<Money>(
    createMoneyFromDecimal(0, assetSymbol, assetDecimals)
  );

  useEffect(() => {
    let amount = Number(field.value);

    if (isNaN(amount) || !isNumber(amount) || amount < 0) {
      amount = 0;
    }

    const assetAmount = createMoneyFromDecimal(amount, assetSymbol, assetDecimals);
    setAssetValue(assetAmount);
  }, [field.value, assetSymbol, assetDecimals]);

  return (
    <styled.span textStyle="body.02" color="ink.text-subdued">
      {Number(field.value) > 0 && '~'}{' '}
      {i18nFormatCurrency(baseCurrencyAmountInQuote(assetValue, marketData))} USD
    </styled.span>
  );
}
