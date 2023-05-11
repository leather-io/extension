import { useEffect } from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { createCounter } from '@app/common/utils/counter';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentTaprootAccountKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { UtxoResponseItem } from '../bitcoin-client';
import { getTaprootAddress, hasInscriptions } from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;

export interface TaprootUtxo extends UtxoResponseItem {
  addressIndex: number;
}

/**
 * Returns all utxos for the user's current taproot account. The search for
 * utxos iterates through all addresses until a sufficiently large number of
 * empty addresses is found.
 */
export function useTaprootAccountUtxosQuery() {
  const network = useCurrentNetwork();
  const keychain = useCurrentTaprootAccountKeychain();
  const client = useBitcoinClient();

  const currentAccountIndex = useCurrentAccountIndex();

  return useQuery(
    ['taproot-address-utxos-metadata', currentAccountIndex, network.id],
    async () => {
      let currentNumberOfAddressesWithoutOrdinals = 0;
      const addressIndexCounter = createCounter(0);
      let foundUnspentTransactions: TaprootUtxo[] = [];
      while (
        currentNumberOfAddressesWithoutOrdinals < stopSearchAfterNumberAddressesWithoutOrdinals
      ) {
        const address = getTaprootAddress({
          index: addressIndexCounter.getValue(),
          keychain,
          network: network.chain.bitcoin.network,
        });

        const unspentTransactions = await client.addressApi.getUtxosByAddress(address);

        if (!hasInscriptions(unspentTransactions)) {
          currentNumberOfAddressesWithoutOrdinals += 1;
          addressIndexCounter.increment();
          continue;
        }

        foundUnspentTransactions = [
          ...unspentTransactions.map(utxo => ({
            // adds addresss index of which utxo belongs
            ...utxo,
            addressIndex: addressIndexCounter.getValue(),
          })),
          ...foundUnspentTransactions,
        ];

        currentNumberOfAddressesWithoutOrdinals = 0;
        addressIndexCounter.increment();
      }
      // return f/oundUnspentTransactions;

      return [];
    },
    {
      staleTime: Infinity,
      cacheTime: 0,
    }
  );
}

export function useTaprootUtxoInfiniteQuery() {
  const network = useCurrentNetwork();
  const keychain = useCurrentTaprootAccountKeychain();
  const client = useBitcoinClient();

  const currentAccountIndex = useCurrentAccountIndex();

  const query = useInfiniteQuery({
    queryKey: ['taproot-utxo-query', currentAccountIndex, network.id],
    async queryFn({ pageParam = 0 }) {
      const address = getTaprootAddress({
        index: pageParam,
        keychain,
        network: network.chain.bitcoin.network,
      });

      // eslint-disable-next-line no-console
      console.log('address', address);

      const unspentTransactions = await client.addressApi.getUtxosByAddress(address);

      return {
        index: pageParam,
        utxos: unspentTransactions.map(utxo => ({ ...utxo, addressIndex: pageParam })),
      };
    },
    getNextPageParam(prevUtxoQuery, utxoQueries) {
      const lastUtxos = [...utxoQueries].slice(-20);

      const hasCheckedMinAmount =
        lastUtxos.length === stopSearchAfterNumberAddressesWithoutOrdinals;

      const hasFoundRecentUtxoActivity = lastUtxos.some(page => page.utxos.length);

      if (hasCheckedMinAmount && !hasFoundRecentUtxoActivity) {
        // Prevents the query from fetching more pages
        return undefined;
      }
      return (prevUtxoQuery.index ?? 0) + 1;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
  });

  // This is to auto trigger new changes. Not 100% sure this is the best way
  useEffect(() => {
    void query.fetchNextPage();
  }, [query, query.data]);

  return query;
}
