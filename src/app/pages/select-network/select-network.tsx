import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { NetworkListLayout } from '@app/pages/select-network/components/network-list.layout';
import { NetworkListItem } from '@app/pages/select-network/network-list-item';
import { useNetworksActions } from '@app/store/networks/networks.hooks';
import { useNetworks } from '@app/store/networks/networks.selectors';

import { AddNetworkButton } from './components/add-network-button';

export function SelectNetwork() {
  const navigate = useNavigate();
  const networks = useNetworks();
  const analytics = useAnalytics();
  const networksActions = useNetworksActions();

  function addNetwork() {
    void analytics.track('add_network');
    navigate(RouteUrls.AddNetwork);
  }

  function selectNetwork(id: string) {
    void analytics.track('change_network', { id });
    networksActions.changeNetwork(id);
    closeNetworkModal();
  }

  function closeNetworkModal() {
    navigate('..');
  }

  return (
    <BaseDrawer title="Select Network" isShowing onClose={closeNetworkModal}>
      <NetworkListLayout>
        {Object.keys(networks).map(id => (
          <NetworkListItem key={id} networkId={id} onNetworkSelected={id => selectNetwork(id)} />
        ))}
      </NetworkListLayout>
      <AddNetworkButton onAddNetwork={addNetwork} />
    </BaseDrawer>
  );
}
