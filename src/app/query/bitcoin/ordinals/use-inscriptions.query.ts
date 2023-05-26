import { useEffect, useRef } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { InscriptionResponseItem } from '@shared/models/inscription.model';
import { ensureArray } from '@shared/utils';

import { createNumArrayOfRange } from '@app/common/utils';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useTaprootCurrentAccountPrivateKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
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

interface AccountData {
  addressesWithoutOrdinalsNum: number;
  fromIndex: number;
  addressesMap: Record<string, number>;
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
  const keychain = useTaprootCurrentAccountPrivateKeychain();
  const currentAccountIndex = useCurrentAccountIndex();

  const defaultAccountData = {
    fromIndex: 0,
    addressesWithoutOrdinalsNum: 0,
    addressesMap: getTaprootAddressData(0, addressesSimultaneousFetchLimit),
  };
  const currentAccData = useRef<AccountData>(defaultAccountData);

  useEffect(() => {
    currentAccData.current = defaultAccountData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccountIndex]);

  function getTaprootAddressData(fromIndex: number, toIndex: number) {
    return createNumArrayOfRange(fromIndex, toIndex - 1).reduce(
      (acc: Record<string, number>, i: number) => {
        const address = getTaprootAddress({
          index: i,
          keychain,
          network: network.chain.bitcoin.network,
        });
        acc[address] = i;
        return acc;
      },
      {}
    );
  }

  const query = useInfiniteQuery({
    queryKey: [QueryPrefixes.InscriptionsFromApiInfiniteQuery, currentAccountIndex, network.id],
    async queryFn({ pageParam }) {
      const responsesArr: InscriptionsQueryResponse[] = [];
      let addressesData = getTaprootAddressData(
        currentAccData.current.fromIndex,
        currentAccData.current.fromIndex + addressesSimultaneousFetchLimit
      );

      // Loop through addresses until we reach the limit, or until we find an address with many inscriptions
      while (
        currentAccData.current.addressesWithoutOrdinalsNum <
        stopSearchAfterNumberAddressesWithoutOrdinals
      ) {
        const response = await fetchInscriptions(
          Object.keys(addressesData),
          pageParam?.offset || 0,
          inscriptionsLazyLoadLimit
        );

        responsesArr.push(response);

        // stop loop to dynamically fetch inscriptions from 1 address if there are many inscriptions
        if (response.total > inscriptionsLazyLoadLimit) {
          currentAccData.current.addressesWithoutOrdinalsNum = 0;
          break;
        }

        currentAccData.current.fromIndex += addressesSimultaneousFetchLimit;
        currentAccData.current.addressesWithoutOrdinalsNum += addressesSimultaneousFetchLimit;

        addressesData = getTaprootAddressData(
          currentAccData.current.fromIndex,
          currentAccData.current.fromIndex + addressesSimultaneousFetchLimit
        );

        // add new addresses to the map
        currentAccData.current.addressesMap = {
          ...currentAccData.current.addressesMap,
          ...addressesData,
        };
        if (response.results.length > 0) {
          currentAccData.current.addressesWithoutOrdinalsNum = 0;
        }
      }

      const results = responsesArr.flatMap(response => response.results);

      // get offset and total from the last response
      const { offset, total } = responsesArr[responsesArr.length - 1];

      return {
        offset: pageParam?.offset ?? offset,
        total,
        stopNextFetch:
          currentAccData.current.addressesWithoutOrdinalsNum >=
          stopSearchAfterNumberAddressesWithoutOrdinals,
        inscriptions: results.map(inscription => ({
          addressIndex: currentAccData.current.addressesMap[inscription.address],
          ...inscription,
        })),
      };
    },
    getNextPageParam(prevInscriptionsQuery) {
      const { offset, total, stopNextFetch } = prevInscriptionsQuery;
      if (stopNextFetch) return undefined;

      // calculate offset for next fetch
      let calculatedOffset = offset + inscriptionsLazyLoadLimit;

      if (offset + inscriptionsLazyLoadLimit > total) {
        calculatedOffset = offset + (total - offset);
      }

      // if we reached the end of the list, start from the beginning
      if (calculatedOffset >= total) {
        calculatedOffset = 0;
      }

      return { offset: calculatedOffset, total };
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
