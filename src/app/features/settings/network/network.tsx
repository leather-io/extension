import { useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { NetworkListItem } from '@app/features/settings/network/network-list-item';
import { useCurrentNetworkState, useNetworksActions } from '@app/store/networks/networks.hooks';
import { useNetworks } from '@app/store/networks/networks.selectors';
import { Button } from '@app/ui/components/button/button';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

const defaultNetworkIds = Object.values(WalletDefaultNetworkConfigurationIds) as string[];

interface NetworkDialogProps {
  onClose(): void;
}

export function NetworkDialog({ onClose }: NetworkDialogProps) {
  const navigate = useNavigate();
  const networks = useNetworks();
  const analytics = useAnalytics();
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
    <Dialog
      header={<DialogHeader title="Change network" />}
      isShowing
      onClose={onClose}
      footer={
        <Footer>
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
        </Footer>
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
        />
      ))}
    </Dialog>
  );
}
