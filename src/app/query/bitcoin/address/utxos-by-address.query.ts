import { useQuery } from '@tanstack/react-query';

import { getTaprootAddress } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getNativeSegwitAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { createCounter } from '@app/common/utils/counter';
import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { UtxoResponseItem, UtxoWithDerivationPath } from '../bitcoin-client';
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

const stopSearchAfterNumberAddressesWithoutUtxos = 20;

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
    [QueryPrefixes.TaprootAddressUtxos, currentAccountIndex, network.id],
    async () => {
      let currentNumberOfAddressesWithoutUtxos = 0;
      const addressIndexCounter = createCounter(0);
      let foundUnspentTransactions: UtxoWithDerivationPath[] = [];
      while (currentNumberOfAddressesWithoutUtxos < stopSearchAfterNumberAddressesWithoutUtxos) {
        const address = getTaprootAddress({
          index: addressIndexCounter.getValue(),
          keychain: account?.keychain,
          network: network.chain.bitcoin.bitcoinNetwork,
        });

        const unspentTransactions = await client.addressApi.getUtxosByAddress(address);

        if (!hasInscriptions(unspentTransactions)) {
          currentNumberOfAddressesWithoutUtxos += 1;
          addressIndexCounter.increment();
          continue;
        }

        foundUnspentTransactions = [
          ...unspentTransactions.map(utxo => {
            const addressIndex = addressIndexCounter.getValue();
            return {
              // adds addresss index of which utxo belongs
              ...utxo,
              addressIndex,
              derivationPath: getNativeSegwitAddressIndexDerivationPath(
                network.chain.bitcoin.bitcoinNetwork,
                currentAccountIndex,
                addressIndex
              ),
            };
          }),
          ...foundUnspentTransactions,
        ];

        currentNumberOfAddressesWithoutUtxos = 0;
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
