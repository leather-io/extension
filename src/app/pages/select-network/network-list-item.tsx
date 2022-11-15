import { defaultCurrentNetwork } from '@shared/constants';

import { useNetworkStatus } from '@app/query/stacks/network/network.hooks';
import { useCurrentNetworkId, useNetworks } from '@app/store/networks/networks.selectors';

import { NetworkListItemLayout } from './components/network-list-item.layout';

interface NetworkListItemProps {
  networkId: string;
  onNetworkSelected(networkId: string): void;
}
export function NetworkListItem({ networkId, onNetworkSelected }: NetworkListItemProps) {
  const currentNetworkId = useCurrentNetworkId();
  const networks = useNetworks();

  const network = networks[networkId] || defaultCurrentNetwork;
  const isOnline = useNetworkStatus(network.chain.stacks.url);

  return (
    <NetworkListItemLayout
      isActive={networkId === currentNetworkId}
      isOnline={isOnline}
      network={network}
      networkId={networkId}
      onSelectNetwork={() => onNetworkSelected(networkId)}
    />
  );
}
