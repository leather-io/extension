import { useCallback, useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { InscriptionResponseItem } from '@shared/models/inscription.model';
import { ensureArray } from '@shared/utils';

import { createNumArrayOfRange } from '@app/common/utils';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useTaprootCurrentPrivateAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { getTaprootAddress } from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;
const addressesSimultaneousFetchLimit = 5;

// max limit value in Hiro API - 60
const inscriptionsLazyLoadLimit = 20;

interface InscriptionsQueryResponse {
  results: InscriptionResponseItem[];
  limit: number;
  offset: number;
  total: number;
}

interface InfiniteQueryPageParam {
  pageParam?: {
    fromIndex: number;
    offset: number;
    addressesWithoutOrdinalsNum: number;
    addressesMap: Record<string, number>;
  };
}

async function fetchInscriptions(addresses: string | string[], offset = 0, limit = 60) {
  const params = new URLSearchParams();
  ensureArray(addresses).forEach(address => params.append('address', address));
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  const res = await fetch('https://api.hiro.so/ordinals/v1/inscriptions?' + params.toString());
  if (!res.ok) throw new Error('Error retrieving inscription metadata');
  const data = await res.json();
  return data as InscriptionsQueryResponse;
}

/**
 * Returns all inscriptions for the user's current taproot account
 */
export function useTaprootInscriptionsInfiniteQuery() {
  const network = useCurrentNetwork();
  const account = useTaprootCurrentPrivateAccount();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentBitcoinAddress = nativeSegwitSigner.address;

  const getTaprootAddressData = useCallback(
    (fromIndex: number, toIndex: number) => {
      return createNumArrayOfRange(fromIndex, toIndex - 1).reduce(
        (acc: Record<string, number>, i: number) => {
          const address = getTaprootAddress({
            index: i,
            keychain: account?.keychain,
            network: network.chain.bitcoin.network,
          });
          acc[address] = i;
          return acc;
        },
        {}
      );
    },
    [account, network.chain.bitcoin.network]
  );

  const query = useInfiniteQuery({
    queryKey: [QueryPrefixes.InscriptionsFromApiInfiniteQuery, currentBitcoinAddress, network.id],
    async queryFn({ pageParam }: InfiniteQueryPageParam) {
      const responsesArr: InscriptionsQueryResponse[] = [];
      let fromIndex = pageParam?.fromIndex ?? 0;
      let addressesWithoutOrdinalsNum = pageParam?.addressesWithoutOrdinalsNum ?? 0;
      let addressesMap =
        pageParam?.addressesMap ??
        getTaprootAddressData(fromIndex, fromIndex + addressesSimultaneousFetchLimit);

      let addressesData = getTaprootAddressData(
        fromIndex,
        fromIndex + addressesSimultaneousFetchLimit
      );

      let offset = pageParam?.offset || 0;
      // Loop through addresses until we reach the limit, or until we find an address with many inscriptions
      while (addressesWithoutOrdinalsNum < stopSearchAfterNumberAddressesWithoutOrdinals) {
        const response = await fetchInscriptions(
          Object.keys(addressesData),
          offset,
          inscriptionsLazyLoadLimit
        );

        responsesArr.push(response);

        // stop loop to dynamically fetch inscriptions from 1 address if there are many inscriptions
        if (response.total > inscriptionsLazyLoadLimit) {
          addressesWithoutOrdinalsNum = 0;
          break;
        }

        // case when we fetched all inscriptions from address with many inscriptions
        if (response.total === 0 && response.offset > 0) {
          offset = 0;
        }

        fromIndex += addressesSimultaneousFetchLimit;
        addressesWithoutOrdinalsNum += addressesSimultaneousFetchLimit;

        addressesData = getTaprootAddressData(
          fromIndex,
          fromIndex + addressesSimultaneousFetchLimit
        );

        // add new addresses to the map
        addressesMap = {
          ...addressesMap,
          ...addressesData,
        };
        if (response.results.length > 0) {
          addressesWithoutOrdinalsNum = 0;
        }
      }

      const results = responsesArr.flatMap(response => response.results);

      // get offset and total from the last response
      const total = responsesArr[responsesArr.length - 1]?.total;

      return {
        offset,
        total,
        stopNextFetch: addressesWithoutOrdinalsNum >= stopSearchAfterNumberAddressesWithoutOrdinals,
        inscriptions: results.map(inscription => ({
          addressIndex: addressesMap[inscription.address],
          ...inscription,
        })),
        fromIndex,
        addressesWithoutOrdinalsNum,
        addressesMap,
      };
    },
    getNextPageParam(prevInscriptionsQuery) {
      const { offset, total, stopNextFetch, fromIndex, addressesWithoutOrdinalsNum, addressesMap } =
        prevInscriptionsQuery;
      if (stopNextFetch) return undefined;

      // calculate offset for next fetch
      let calculatedOffset = offset + inscriptionsLazyLoadLimit;

      if (offset + inscriptionsLazyLoadLimit > total) {
        calculatedOffset = offset + (total - offset);
      }

      return {
        offset: calculatedOffset,
        total,
        fromIndex,
        addressesWithoutOrdinalsNum,
        addressesMap,
      };
    },
    staleTime: 3 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return query;
}

export function useInscriptionByAddressQuery(address: string) {
  const network = useCurrentNetwork();

  const query = useInfiniteQuery({
    queryKey: [QueryPrefixes.InscriptionsByAddress, address, network.id],
    async queryFn({ pageParam = 0 }) {
      return fetchInscriptions(address, pageParam);
    },
    getNextPageParam(prevInscriptionQuery) {
      if (prevInscriptionQuery.offset >= prevInscriptionQuery.total) return undefined;
      return prevInscriptionQuery.offset + 60;
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
