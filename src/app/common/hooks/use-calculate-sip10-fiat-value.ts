import { useMemo } from 'react';

import { type MarketData, createMarketData, createMarketPair } from '@leather.io/models';
import {
  useAlexCurrencyPriceAsMarketData,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';

import { getPrincipalFromContractId } from '../utils';

export function castBitcoinMarketDataToSbtcMarketData(bitcoinMarketData: MarketData) {
  return createMarketData(
    createMarketPair('sBTC', 'USD'),
    createMoney(bitcoinMarketData.price.amount.toNumber(), 'USD')
  );
}

export function useSip10FiatMarketData() {
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { isSbtcContract } = useConfigSbtc();

  return useMemo(
    () => ({
      getTokenMarketData(principal: string, symbol: string) {
        const lookupIdentifier = principal.includes('::')
          ? getPrincipalFromContractId(principal)
          : principal;

        if (isSbtcContract(lookupIdentifier)) {
          return castBitcoinMarketDataToSbtcMarketData(bitcoinMarketData);
        }

        return priceAsMarketData(lookupIdentifier, symbol);
      },
    }),
    [bitcoinMarketData, isSbtcContract, priceAsMarketData]
  );
}
