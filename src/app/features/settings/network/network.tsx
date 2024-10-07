import { useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { WalletDefaultNetworkConfigurationIds } from '@leather.io/models';
import { Button, Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { NetworkListItem } from '@app/features/settings/network/network-list-item';
import { useCurrentNetworkState, useNetworksActions } from '@app/store/networks/networks.hooks';
import { useNetworks } from '@app/store/networks/networks.selectors';

const defaultNetworkIds = Object.values(WalletDefaultNetworkConfigurationIds) as string[];

interface NetworkSheetProps {
  onClose(): void;
}

export function NetworkSheet({ onClose }: NetworkSheetProps) {
  const navigate = useNavigate();
  const networks = useNetworks();
  const networksActions = useNetworksActions();
  const currentNetwork = useCurrentNetworkState();

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
  }

  return (
    <Sheet
      header={<SheetHeader title="Change network" />}
      isShowing
      onClose={onClose}
      footer={
        <Button
          data-testid={SettingsSelectors.AddNewNetworkBtn}
          fullWidth
          onClick={() => {
            addNetwork();
            onClose();
          }}
        >
          Add a network
        </Button>
      }
    >
      {Object.keys(networks).map(id => (
        <NetworkListItem
          key={id}
          networkId={id}
          onNetworkSelected={id => {
            selectNetwork(id);
            onClose();
          }}
          isCustom={!defaultNetworkIds.includes(id)}
          onRemoveNetwork={id => {
            if (id === currentNetwork.id) networksActions.changeNetwork('mainnet');
            removeNetwork(id);
          }}
          onEditNetwork={() => {
            onClose();
            navigate(RouteUrls.EditNetwork, {
              state: {
                network: networks[id],
              },
            });
          }}
        />
      ))}
    </Sheet>
  );
}
