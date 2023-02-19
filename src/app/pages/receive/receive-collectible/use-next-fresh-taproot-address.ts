import { useQuery } from '@tanstack/react-query';

import { recurseAccountsForActivity } from '@app/common/account-restoration/account-restore';
import { getTaprootAddress, hasOrdinals } from '@app/query/bitcoin/ordinals/utils';
import { useKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export function useNextFreshTaprootAddressQuery() {
  const network = useCurrentNetwork();
  const account = useCurrentAccount();
  const keychain = useKeychain();
  const client = useBitcoinClient();

  return useQuery(
    ['next-taproot-address', account, keychain, network, client] as const,
    async ({ queryKey }) => {
      const [_, __, keychain, network] = queryKey;

      if (!keychain) throw new Error('Expected keychain to be provided.');

      const key = keychain(0);

      async function isTaprootAccountBeingUsed(index: number): Promise<boolean> {
        const address = getTaprootAddress(index, key, network);
        const unspentTransactions = await client.addressApi.getUtxosByAddress(address);

        return hasOrdinals(unspentTransactions);
      }

      const highestUsedAddressIndex = await recurseAccountsForActivity({
        doesAddressHaveActivityFn: isTaprootAccountBeingUsed,
      });

      const nextFreeAccountIndex = highestUsedAddressIndex + 1;
      const taprootAddress = getTaprootAddress(nextFreeAccountIndex, key, network);

      return taprootAddress;
    },
    {
      // This query needs to be run each time it is used as there is no way to
      // know whether the previously found address has received an ordinal since
      // it was last cached.
      cacheTime: 0,
    }
  );
}
