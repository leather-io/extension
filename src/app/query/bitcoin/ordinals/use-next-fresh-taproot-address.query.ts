import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { createCounter } from '@app/common/utils/counter';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';
import { getTaprootAddress } from '@app/query/bitcoin/ordinals/utils';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useTaprootAccountKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

// ts-unused-exports:disable-next-line
export function useNextFreshTaprootAddressQuery(accIndex?: number) {
  const network = useCurrentNetwork();
  const currentAccountIndex = useCurrentAccountIndex();
  const account = useTaprootAccountKeychain(accIndex ?? currentAccountIndex);
  const client = useBitcoinClient();

  const [highestKnownAccountActivity, setHighestKnownAccountActivity] = useState(0);

  return useQuery(
    ['next-taproot-address', currentAccountIndex, network.id] as const,
    async () => {
      if (!account) throw new Error('Expected keychain to be provided');

      async function taprootAddressIndexActivity(index: number) {
        const address = getTaprootAddress({
          index,
          keychain: account?.keychain,
          network: network.chain.bitcoin.network,
        });
        const utxos = await client.addressApi.getUtxosByAddress(address);
        return { address, utxos };
      }

      const taprootUtxosByIndex: { index: number; address: string; utxos: UtxoResponseItem[] }[] =
        [];
      const counter = createCounter(highestKnownAccountActivity);

      function hasFoundEmptyAddress() {
        return taprootUtxosByIndex.some(({ utxos }) => utxos.length === 0);
      }

      while (!hasFoundEmptyAddress() || taprootUtxosByIndex.length === 0) {
        const { utxos, address } = await taprootAddressIndexActivity(counter.getValue());
        taprootUtxosByIndex.push({
          index: counter.getValue(),
          utxos,
          address,
        });
        counter.increment();
      }

      const emptyAddresses = taprootUtxosByIndex.filter(({ utxos }) => utxos.length === 0);

      if (emptyAddresses.length !== 1)
        throw new Error('Should not have found multiple empty addresses');

      const [emptyAddress] = emptyAddresses;

      // Check shouldn't be necessary, but just in case
      if (emptyAddress.utxos.length !== 0) throw new Error('Address found not empty');

      setHighestKnownAccountActivity(Math.max(0, emptyAddress.index - 1));
      return emptyAddress.address;
    },
    {
      // This query needs to be run each time it is used as there is no way to
      // know whether the previously found address has received an ordinal since
      // it was last cached.
      cacheTime: 0,
    }
  );
}
