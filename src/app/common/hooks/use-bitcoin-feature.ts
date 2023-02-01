import { featureFlags } from '@shared/feature-flags';

import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export function useBitcoinFeature() {
  const network = useCurrentNetwork();
  return {
    isBitcoinEnabled: network.chain.bitcoin.network === 'testnet' && featureFlags.bitcoinEnabled,
  };
}
