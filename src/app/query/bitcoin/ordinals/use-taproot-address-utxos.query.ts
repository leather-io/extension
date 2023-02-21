import { useQuery } from '@tanstack/react-query';

import { createCounter } from '@app/common/utils/counter';
import { useCurrentTaprootAccountKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { UtxoResponseItem } from '../bitcoin-client';
import { getTaprootAddress, hasOrdinals } from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 5;

/**
 * Returns all utxos for the user's current taproot account. The search for
 * utxos iterates through all addresses until a sufficiently large number of
 * empty addresses is found.
 */
export function useTaprootAddressUtxosQuery() {
  const network = useCurrentNetwork();
  const keychain = useCurrentTaprootAccountKeychain();
  const client = useBitcoinClient();

  return useQuery(['taproot-address-utxos-metadata', keychain.pubKeyHash, network.id], async () => {
    let currentNumberOfAddressesWithoutOrdinals = 0;
    const counter = createCounter(0);
    let foundUnspentTransactions: UtxoResponseItem[] = [];
    while (
      currentNumberOfAddressesWithoutOrdinals < stopSearchAfterNumberAddressesWithoutOrdinals
    ) {
      const address = getTaprootAddress(
        counter.getValue(),
        keychain,
        network.chain.bitcoin.network
      );

      const unspentTransactions = await client.addressApi.getUtxosByAddress(address);

      if (!hasOrdinals(unspentTransactions)) {
        currentNumberOfAddressesWithoutOrdinals += 1;
        counter.increment();
        continue;
      }

      foundUnspentTransactions = foundUnspentTransactions.concat(unspentTransactions);

      currentNumberOfAddressesWithoutOrdinals = 0;
      counter.increment();
    }

    return foundUnspentTransactions;
  });
}
