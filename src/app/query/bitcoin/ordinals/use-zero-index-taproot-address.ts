import { getTaprootAddress } from '@app/query/bitcoin/ordinals/utils';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useTaprootAccountKeychain } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

// Temporary - remove with privacy mode
export function useZeroIndexTaprootAddress(accIndex?: number) {
  const network = useCurrentNetwork();
  const currentAccountIndex = useCurrentAccountIndex();
  const account = useTaprootAccountKeychain(accIndex ?? currentAccountIndex);

  if (!account) throw new Error('Expected keychain to be provided');

  const address = getTaprootAddress({
    index: 0,
    keychain: account.keychain,
    network: network.chain.bitcoin.network,
  });

  return address;
}
