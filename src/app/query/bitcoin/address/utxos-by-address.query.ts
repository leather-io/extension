import { useQuery } from '@tanstack/react-query';

import { getTaprootAddress } from '@shared/crypto/bitcoin/bitcoin.utils';

import { createCounter } from '@app/common/utils/counter';
import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { TaprootUtxo, UtxoResponseItem } from '../bitcoin-client';
import { hasInscriptions } from './address.utils';

const staleTime = 3 * 60 * 1000;

const queryOptions = { staleTime, refetchOnWindowFocus: false };

export function useGetUtxosByAddressQuery<T extends unknown = UtxoResponseItem[]>(
  address: string,
  options?: AppUseQueryConfig<UtxoResponseItem[], T>
) {
  const client = useBitcoinClient();
  return useQuery({
    enabled: !!address,
    queryKey: ['btc-utxos-by-address', address],
    queryFn: () => client.addressApi.getUtxosByAddress(address),
    ...queryOptions,
    ...options,
  });
}

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;

/**
 * Returns all utxos for the user's current taproot account. The search for
 * utxos iterates through all addresses until a sufficiently large number of
 * empty addresses is found.
 */
export function useTaprootAccountUtxosQuery() {
  const network = useCurrentNetwork();
  const account = useCurrentTaprootAccount();
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
          keychain: account?.keychain,
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
      return foundUnspentTransactions;
    },
    {
      refetchInterval: 15000,
      refetchOnWindowFocus: false,
    }
  );
}
