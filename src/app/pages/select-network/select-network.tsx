import { useNavigate } from 'react-router-dom';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useLocationState } from '@app/common/hooks/use-location-state';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { NetworkListLayout } from '@app/pages/select-network/components/network-list.layout';
import { NetworkListItem } from '@app/pages/select-network/network-list-item';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { useCurrentNetworkState, useNetworksActions } from '@app/store/networks/networks.hooks';
import { useNetworks } from '@app/store/networks/networks.selectors';

import { AddNetworkButton } from './components/add-network-button';

const defaultNetworkIds = Object.values(WalletDefaultNetworkConfigurationIds) as string[];

export function SelectNetwork() {
  useBackgroundLocationRedirect();
  const navigate = useNavigate();
  const networks = useNetworks();
  const analytics = useAnalytics();
  const networksActions = useNetworksActions();
  const currentNetwork = useCurrentNetworkState();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');

  function addNetwork() {
    void analytics.track('add_network');
    navigate(RouteUrls.AddNetwork);
  }

  function removeNetwork(id: string) {
    void analytics.track('remove_network');
    networksActions.removeNetwork(id);
  }

  function selectNetwork(id: string) {
    void analytics.track('change_network', { id });
    networksActions.changeNetwork(id);
    closeNetworkModal();
  }

  function closeNetworkModal() {
    navigate(backgroundLocation ?? '..');
  }

  return (
    <BaseDrawer title="Select Network" isShowing onClose={closeNetworkModal}>
      <NetworkListLayout>
        {Object.keys(networks).map(id => (
          <NetworkListItem
            key={id}
            networkId={id}
            onNetworkSelected={id => selectNetwork(id)}
            isCustom={!defaultNetworkIds.includes(id)}
            onRemoveNetwork={id => {
              if (id === currentNetwork.id) networksActions.changeNetwork('mainnet');
              removeNetwork(id);
            }}
          />
        ))}
      </NetworkListLayout>
      <AddNetworkButton onAddNetwork={addNetwork} />
    </BaseDrawer>
  );
}
