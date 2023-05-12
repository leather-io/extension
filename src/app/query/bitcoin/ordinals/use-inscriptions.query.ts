import { useQuery } from '@tanstack/react-query';

import { Inscription, InscriptionResponseItem } from '@shared/models/inscription.model';

import { createNullArrayOfLength } from '@app/common/utils';
import { createCounter } from '@app/common/utils/counter';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentTaprootAccountKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { getTaprootAddress } from './utils';

const stopSearchAfterNumberAddressesWithoutOrdinals = 20;
const addressesSimultaneousFetchLimit = 5;

// max limit value in Hiro API
const inscriptionsLimit = 60;

async function fetchInscriptions(addresses: string) {
  const res = await fetch(
    `https://api.hiro.so/ordinals/v1/inscriptions?limit=${inscriptionsLimit}&${addresses}`
  );
  if (!res.ok) throw new Error('Error retrieving inscription metadata');
  const data = await res.json();
  return data.results as InscriptionResponseItem[];
}

/**
 * Returns all inscriptions for the user's current taproot account
 */
export function useGetInscriptionsQuery() {
  const network = useCurrentNetwork();
  const keychain = useCurrentTaprootAccountKeychain();
  const currentAccountIndex = useCurrentAccountIndex();

  return useQuery(
    [QueryPrefixes.InscriptionsFromApi, currentAccountIndex, network.id],
    async () => {
      let currentNumberOfAddressesWithoutOrdinals = 0;
      const addressIndexCounter = createCounter(0);
      const inscriptionsArr: Inscription[] = [];
      while (
        currentNumberOfAddressesWithoutOrdinals < stopSearchAfterNumberAddressesWithoutOrdinals
      ) {
        const addressesMap = createNullArrayOfLength(addressesSimultaneousFetchLimit).reduce(
          (acc, _) => {
            const address = getTaprootAddress({
              index: addressIndexCounter.getValue(),
              keychain,
              network: network.chain.bitcoin.network,
            });
            acc[address] = addressIndexCounter.getValue();
            addressIndexCounter.increment();
            return acc;
          },
          {}
        );

        const addressesQueryParam = Object.keys(addressesMap).reduce((acc, address) => {
          acc.append('address', address);
          return acc;
        }, new URLSearchParams());

        const inscriptions = await fetchInscriptions(addressesQueryParam.toString());

        if (inscriptions.length === 0) {
          currentNumberOfAddressesWithoutOrdinals += addressesSimultaneousFetchLimit;
          continue;
        }
        inscriptionsArr.push(
          ...inscriptions.map(inscription => ({
            ...inscription,
            addressIndex: addressesMap[inscription.address],
          }))
        );
        currentNumberOfAddressesWithoutOrdinals = 0;
      }
      return inscriptionsArr;
    }
  );
}
