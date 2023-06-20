import { useCallback, useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { createNumArrayOfRange } from '@app/common/utils';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

const addressesSimultaneousFetchLimit = 5;
const stopSearchAfterNumberAddressesWithoutBrc20Tokens = 20;

interface Brc20TokenResponse {
  available_balance: string;
  overall_balance: string;
  tick: string;
}

export interface Brc20Token extends Brc20TokenResponse {
  decimals: number;
}

interface Brc20TokenTicker {
  ticker: {
    tick: string;
    max_supply: string;
    decimals: number;
    limit_per_mint: string;
    remaining_supply: string;
    deploy_incr_number: number;
  }[];
  sales: { total_sale: string; sale_24h: string; sale_7d: string }[];
  holders: { holders: number }[];
}

async function fetchTickerData(ticker: string): Promise<Brc20TokenTicker[]> {
  const res = await fetch(`https://brc20api.bestinslot.xyz/v1/get_brc20_ticker/${ticker}`);
  if (!res.ok) throw new Error('Failed to fetch BRC-20 token ticker data');
  return res.json();
}

async function fetchBrc20TokensByAddress(address: string): Promise<Brc20Token[]> {
  const res = await fetch(`https://brc20api.bestinslot.xyz/v1/get_brc20_balance/${address}`);

  if (!res.ok) throw new Error('Failed to fetch BRC-20 token balances');
  const tokensData = await res.json();

  const tickerPromises = tokensData.map((token: Brc20TokenResponse) => {
    return fetchTickerData(token.tick);
  });

  const tickerData = await Promise.all(tickerPromises);

  // add decimals to token data
  return tokensData.map((token: Brc20TokenResponse, index: number) => {
    return {
      ...token,
      decimals: tickerData[index].ticker[0].decimals,
    };
  });
}

export function useBrc20TokensQuery() {
  const network = useCurrentNetwork();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentBitcoinAddress = nativeSegwitSigner.address;
  const createSigner = useCurrentAccountTaprootSigner();

  const getTaprootAddressData = useCallback(
    (fromIndex: number, toIndex: number) => {
      return createNumArrayOfRange(fromIndex, toIndex - 1).map(num => {
        // TO-DO remove this check when we have a better way to handle this
        if (!createSigner) return '';
        const address = createSigner(num).address;
        return address;
      });
    },
    [createSigner]
  );
  const query = useInfiniteQuery({
    queryKey: [QueryPrefixes.Brc20InfiniteQuery, currentBitcoinAddress, network.id],
    async queryFn({ pageParam }) {
      const fromIndex: number = pageParam?.fromIndex ?? 0;

      const addressesData = getTaprootAddressData(
        fromIndex,
        fromIndex + addressesSimultaneousFetchLimit
      );
      const brc20TokensPromises = addressesData.map(address => {
        return fetchBrc20TokensByAddress(address);
      });

      const brc20Tokens = await Promise.all(brc20TokensPromises);

      return {
        brc20Tokens,
        fromIndex,
      };
    },
    getNextPageParam(prevInscriptionQuery) {
      const { fromIndex, brc20Tokens } = prevInscriptionQuery;

      if (fromIndex >= stopSearchAfterNumberAddressesWithoutBrc20Tokens) {
        return undefined;
      }

      return {
        fromIndex: fromIndex + addressesSimultaneousFetchLimit,
        brc20Tokens,
      };
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
  });

  // Auto-trigger next request
  useEffect(() => {
    void query.fetchNextPage();
  }, [query, query.data]);

  return query;
}
