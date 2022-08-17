import { Dictionary } from '@reduxjs/toolkit';
import { ChainID } from '@stacks/transactions';

import { NetworkConfiguration } from '@shared/constants';

interface FindMatchingNetworkKeyArgs {
  coreApiUrl: string | null;
  networkChainId: string | null;
  networks: Dictionary<NetworkConfiguration>;
}
export function findMatchingNetworkKey({
  coreApiUrl,
  networkChainId,
  networks,
}: FindMatchingNetworkKeyArgs) {
  if (!networks || (!coreApiUrl && !networkChainId)) return;

  const keys = Object.keys(networks);

  const exactUrlMatch = keys.find((key: string) => {
    const network = networks[key] as NetworkConfiguration;
    return network.url === coreApiUrl;
  });
  if (exactUrlMatch) return exactUrlMatch;

  const chainIdMatch = keys.find((key: string) => {
    const network = networks[key] as NetworkConfiguration;
    return network.url === coreApiUrl || network.chainId === (Number(networkChainId) as ChainID);
  });
  if (chainIdMatch) return chainIdMatch;

  return null;
}
