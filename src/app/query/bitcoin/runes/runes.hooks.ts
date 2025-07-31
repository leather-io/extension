import { bitcoinNetworkToNetworkMode } from '@leather.io/models';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useLeatherNetwork } from '@app/query/leather-query-provider';

import { useGetRunesOutputsByAddressQuery } from './runes-outputs-by-address.query';

export function useRunesEnabled() {
  const runesEnabled = useConfigRunesEnabled();
  const network = useLeatherNetwork();

  return (
    runesEnabled || bitcoinNetworkToNetworkMode(network.chain.bitcoin.bitcoinNetwork) === 'testnet'
  );
}

export function useRunesOutputsByAddress(address: string) {
  return useGetRunesOutputsByAddressQuery(address);
}
