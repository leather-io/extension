import { useEffect, useRef } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { InscriptionResponseItem } from '@shared/models/inscription.model';

import { createNumArrayOfRange } from '@app/common/utils';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useTaprootCurrentAccountPrivateKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { getTaprootAddress } from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;
const addressesSimultaneousFetchLimit = 5;

// max limit value in Hiro API - 60
const inscriptionsLimit = 20;

interface InscriptionsQueryResponse {
  results: InscriptionResponseItem[];
  limit: number;
  offset: number;
  total: number;
}

function formQueryParams(addressesMap: Record<string, number>) {
  return Object.keys(addressesMap).reduce((acc, address) => {
    acc.append('address', address);
    return acc;
  }, new URLSearchParams());
}

async function fetchInscriptions(addresses: string, offset = 0) {
  const res = await fetch(
    `https://api.hiro.so/ordinals/v1/inscriptions?limit=${inscriptionsLimit}&offset=${offset}&${addresses}`
  );
  if (!res.ok) throw new Error('Error retrieving inscription metadata');
  const data = await res.json();
  return data as InscriptionsQueryResponse;
}

/**
 * Returns all inscriptions for the user's current taproot account
 */
export function useInscriptionsInfiniteQuery() {
  const network = useCurrentNetwork();
  const keychain = useTaprootCurrentAccountPrivateKeychain();
  const currentAccountIndex = useCurrentAccountIndex();

  // TO-DO remove code for testing purposes before merge
  const searchParams = new URLSearchParams(document.location.search);
  const testInscriptionAddress = searchParams.get('testAddress');
  const currentNumberOfAddressesWithoutOrdinals = useRef(0);

  const fromIndex = useRef(0);
  const addressesMap = useRef(
    getAddressesData(fromIndex.current, fromIndex.current + addressesSimultaneousFetchLimit)
  );
  const queryParams = useRef(formQueryParams(addressesMap.current));

  // get taproot addresses
  function getAddressesData(fromIndex: number, toIndex: number) {
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
      // loop through addresses until we reach the limit or until we find an address with many inscriptions
      while (
        currentNumberOfAddressesWithoutOrdinals.current <
        stopSearchAfterNumberAddressesWithoutOrdinals
      ) {
        const response = await fetchInscriptions(
          testInscriptionAddress || queryParams.current.toString(),
          pageParam?.offset || 0
        );

        responsesArr.push(response);

        // stop loop to dynamically fetch inscriptions from 1 address if there are many inscriptions
        if (response.total > inscriptionsLimit) {
          currentNumberOfAddressesWithoutOrdinals.current = 0;
          break;
        }

        fromIndex.current += addressesSimultaneousFetchLimit;
        currentNumberOfAddressesWithoutOrdinals.current += addressesSimultaneousFetchLimit;

        const addressesData = getAddressesData(
          fromIndex.current,
          fromIndex.current + addressesSimultaneousFetchLimit
        );
        queryParams.current = formQueryParams(addressesData);

        // add new addresses to the map
        addressesMap.current = { ...addressesMap.current, ...addressesData };
        if (response.results.length > 0) {
          currentNumberOfAddressesWithoutOrdinals.current = 0;
        }
      }

      const results = responsesArr.flatMap(response => response.results);

      // get offset and total from the last response
      const { offset, total } = responsesArr[responsesArr.length - 1];

      return {
        offset: pageParam?.offset ?? offset,
        total,
        stopNextFetch:
          currentNumberOfAddressesWithoutOrdinals.current >=
          stopSearchAfterNumberAddressesWithoutOrdinals,
        inscriptions: results.map(inscription => ({
          addressIndex: addressesMap.current[inscription.address],
          ...inscription,
        })),
      };
    },
    getNextPageParam(prevInscriptionsQuery) {
      const { offset, total, stopNextFetch } = prevInscriptionsQuery;
      if (stopNextFetch) return undefined;

      // calculate offset for next fetch
      let calculatedOffset = offset + inscriptionsLimit;

      if (offset + inscriptionsLimit > total) {
        calculatedOffset = offset + (total - offset);
      }

      // if we reached the end of the list, start from the beginning
      if (calculatedOffset >= total) {
        calculatedOffset = 0;
      }

      return { offset: calculatedOffset, total };
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return query;
}

// TODO: Duplicated, to refactor
async function fetchInscription(address: string, offset = 0) {
  const res = await fetch(
    `https://api.hiro.so/ordinals/v1/inscriptions?limit=60&offset=${offset}&address=${address}`
  );
  if (!res.ok) throw new Error('Error retrieving inscription metadata');
  const data = await res.json();
  return data as InscriptionsQueryResponse;
}

export function useInscriptionByAddressQuery(address: string) {
  const network = useCurrentNetwork();

  const query = useInfiniteQuery({
    queryKey: [QueryPrefixes.InscriptionsByAddress, address, network.id],
    async queryFn({ pageParam = 0 }) {
      return fetchInscription(address, pageParam);
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
