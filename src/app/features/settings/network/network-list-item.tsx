import { defaultCurrentNetwork } from '@leather.io/models';
import { useGetStacksNetworkStatusQuery } from '@leather.io/query';

import { useCurrentNetworkId, useNetworks } from '@app/store/networks/networks.selectors';

import { NetworkListItemLayout } from './components/network-list-item.layout';

interface NetworkListItemProps {
  networkId: string;
  isCustom: boolean;
  onNetworkSelected(networkId: string): void;
  onRemoveNetwork(networkId: string): void;
  onEditNetwork(): void;
}
export function NetworkListItem({
  networkId,
  onNetworkSelected,
  onRemoveNetwork,
  isCustom,
  onEditNetwork,
}: NetworkListItemProps) {
  const currentNetworkId = useCurrentNetworkId();
  const networks = useNetworks();

  const network = networks[networkId] || defaultCurrentNetwork;
  const { isSuccess } = useGetStacksNetworkStatusQuery(network.chain.stacks.url);

  return (
    <NetworkListItemLayout
      isActive={networkId === currentNetworkId}
      isOnline={isSuccess}
      network={network}
      networkId={networkId}
      isCustom={isCustom}
      onSelectNetwork={() => onNetworkSelected(networkId)}
      onEditNetwork={onEditNetwork}
      onRemoveNetwork={onRemoveNetwork}
    />
  );
}
