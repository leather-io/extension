import { useCallback, useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { createNumArrayOfRange } from '@app/common/utils';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

const addressesSimultaneousFetchLimit = 3;
const stopSearchAfterNumberAddressesWithoutBrc20Tokens = 3;

export function useGetBrc20TokensQuery() {
  const network = useCurrentNetwork();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentNsBitcoinAddress = nativeSegwitSigner.address;
  const createSigner = useCurrentAccountTaprootSigner();
  const analytics = useAnalytics();
  const client = useBitcoinClient();

  if (!createSigner) throw new Error('No signer');

  const getNextTaprootAddressBatch = useCallback(
    (fromIndex: number, toIndex: number) => {
      return createNumArrayOfRange(fromIndex, toIndex - 1).map(num => {
        const address = createSigner(num).address;
        return address;
      });
    },
    [createSigner]
  );

  const query = useInfiniteQuery({
    queryKey: [QueryPrefixes.GetBrc20Tokens, currentNsBitcoinAddress, network.id],
    async queryFn({ pageParam }) {
      const fromIndex: number = pageParam?.fromIndex ?? 0;
      let addressesWithoutTokens = pageParam?.addressesWithoutTokens ?? 0;

      const addressesData = getNextTaprootAddressBatch(
        fromIndex,
        fromIndex + addressesSimultaneousFetchLimit
      );

      if (fromIndex === 0) {
        addressesData.unshift(currentNsBitcoinAddress);
      }

      const brc20TokensPromises = addressesData.map(async address => {
        const brc20Tokens = await client.bestinSlotApi.getBrc20Balances(address);

        const tickerPromises = await Promise.all(
          brc20Tokens.data.map(token => {
            return client.bestinSlotApi.getBrc20TickerInfo(token.ticker);
          })
        );

        return brc20Tokens.data.map((token, index) => {
          return {
            balance: token,
            holderAddress: address,
            info: tickerPromises[index].data,
          };
        });
      });

      const brc20Tokens = await Promise.all(brc20TokensPromises);
      addressesWithoutTokens += brc20Tokens.filter(tokens => tokens.length === 0).length;

      return {
        addressesWithoutTokens,
        brc20Tokens,
        fromIndex,
      };
    },
    getNextPageParam(prevInscriptionQuery) {
      const { fromIndex, brc20Tokens, addressesWithoutTokens } = prevInscriptionQuery;

      if (addressesWithoutTokens >= stopSearchAfterNumberAddressesWithoutBrc20Tokens) {
        return undefined;
      }

      return {
        fromIndex: fromIndex + addressesSimultaneousFetchLimit,
        addressesWithoutTokens,
        brc20Tokens,
      };
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });

  // Auto-trigger next request
  useEffect(() => {
    if (query.hasNextPage) {
      void query.fetchNextPage();
    }
  }, [query, query.data]);

  useEffect(() => {
    const brc20AcrossAddressesCount = query.data?.pages.reduce((acc, page) => {
      return acc + page.brc20Tokens.flatMap(item => item).length;
    }, 0);

    if (!query.hasNextPage && brc20AcrossAddressesCount && brc20AcrossAddressesCount > 0) {
      void analytics.identify({
        brc20_across_addresses_count: brc20AcrossAddressesCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, query.hasNextPage]);
  return query;
}
