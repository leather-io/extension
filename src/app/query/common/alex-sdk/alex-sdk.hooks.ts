import { useCallback } from 'react';

import { type Currency } from 'alex-sdk';
import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { pullContractIdFromIdentity } from '@app/common/utils';

import { useAlexSdkLatestPricesQuery } from './latest-prices.query';
import { useAlexSdkSwappableCurrencyQuery } from './swappable-currency.query';

export function useAlexSdKCurrencyPriceAsMoney() {
  const { data: supportedCurrencies = [] } = useAlexSdkSwappableCurrencyQuery();
  const { data: prices } = useAlexSdkLatestPricesQuery();

  return useCallback(
    (principal: string) => {
      if (!prices) {
        logger.error('Latest prices could not be found');
        return null;
      }
      const tokenInfo = supportedCurrencies
        .filter(isDefined)
        .find(token => pullContractIdFromIdentity(token.contractAddress) === principal);
      const currency = tokenInfo?.id as Currency;
      const price = convertAmountToFractionalUnit(new BigNumber(prices[currency] ?? 0), 2);
      return createMoney(price, 'USD');
    },
    [prices, supportedCurrencies]
  );
}
