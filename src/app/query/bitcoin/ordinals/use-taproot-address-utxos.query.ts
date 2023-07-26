import { useQuery } from '@tanstack/react-query';

import { createCounter } from '@app/common/utils/counter';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
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
