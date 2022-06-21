import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@stacks/ui';

import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';
import { RouteUrls } from '@shared/route-urls';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useShowNetworksStore } from '@app/store/ui/ui.hooks';
import { NetworkList } from '@app/features/network-drawer/network-list';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

export const NetworksDrawer = () => {
  const { setShowNetworks } = useDrawers();
  const [isShowing] = useShowNetworksStore();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  const handleAddNetworkClick = useCallback(() => {
    void analytics.track('add_network');
    setShowNetworks(false);
    navigate(RouteUrls.AddNetwork);
  }, [analytics, setShowNetworks, navigate]);

  return (
    <ControlledDrawer
      title="Select Network"
      isShowing={isShowing}
      onClose={() => setShowNetworks(false)}
    >
      {isShowing && <NetworkList />}
      <Box pb="loose" width="100%" px="loose" mt="base">
        <Button
          borderRadius="10px"
          onClick={handleAddNetworkClick}
          data-testid={SettingsSelectors.BtnAddNetwork}
        >
          Add a network
        </Button>
      </Box>
    </ControlledDrawer>
  );
};
