import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import {
  type RuneBalance,
  type RuneTickerInfo,
  createGetRunesTickerInfoQueryOptions,
  createRuneAssetDetails,
} from '@leather.io/query';
import { baseCurrencyAmountInQuote, createMoney } from '@leather.io/utils';

import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useBestInSlotApiRateLimiter } from '@app/query/rate-limiter/best-in-slot-limiter';

import { useBitcoinClient } from '../clients/bitcoin-client';
import { useRunesEnabled } from './runes.hooks';

const queryOptions = { staleTime: 5 * 60 * 1000 } as const;

export function useGetRunesTickerInfoQuery(runesBalances: RuneBalance[]) {
  const client = useBitcoinClient();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const runesEnabled = useRunesEnabled();
  const limiter = useBestInSlotApiRateLimiter();

  return useQueries({
    queries: runesBalances.map(runeBalance => {
      return {
        ...createGetRunesTickerInfoQueryOptions({ client, runeBalance, runesEnabled, limiter }),
        select: (resp: RuneTickerInfo) => {
          const fiatPrice = baseCurrencyAmountInQuote(
            createMoney(
              new BigNumber(resp.avg_unit_price_in_sats ?? resp.min_listed_unit_price_in_sats ?? 0),
              'BTC'
            ),
            btcMarketData
          );
          return createRuneAssetDetails(runeBalance, resp, fiatPrice);
        },
        ...queryOptions,
      };
    }),
  });
}
