import { defaultCurrentNetwork } from '@shared/constants';

import { useNetworkStatus } from '@app/query/stacks/network/network.hooks';
import { useCurrentNetworkId, useNetworks } from '@app/store/networks/networks.selectors';

import { NetworkListItemLayout } from './components/network-list-item.layout';

interface NetworkListItemProps {
  networkId: string;
  isCustom: boolean;
  onNetworkSelected(networkId: string): void;
  onRemoveNetwork(networkId: string): void;
}
export function NetworkListItem({
  networkId,
  onNetworkSelected,
  onRemoveNetwork,
  isCustom,
}: NetworkListItemProps) {
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
      isCustom={isCustom}
      onSelectNetwork={() => onNetworkSelected(networkId)}
      onRemoveNetwork={onRemoveNetwork}
    />
  );
}
