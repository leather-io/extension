import { useMemo } from 'react';

import { type MarketData, createMarketData, createMarketPair } from '@leather.io/models';
import { getPrincipalFromAssetString } from '@leather.io/stacks';
import { createMoney } from '@leather.io/utils';

import { useAlexCurrencyPriceAsMarketData } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';

function castBitcoinMarketDataToSbtcMarketData(bitcoinMarketData: MarketData) {
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
      getTokenMarketData(identifier: string, symbol: string) {
        const lookupIdentifier = identifier.includes('::')
          ? getPrincipalFromAssetString(identifier)
          : identifier;

        if (isSbtcContract(lookupIdentifier)) {
          return castBitcoinMarketDataToSbtcMarketData(bitcoinMarketData);
        }

        return priceAsMarketData(lookupIdentifier, symbol);
      },
    }),
    [bitcoinMarketData, isSbtcContract, priceAsMarketData]
  );
}
