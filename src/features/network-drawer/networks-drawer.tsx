import { useCallback } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@stacks/ui';

import { ControlledDrawer } from '@components/drawer/controlled';
import { RouteUrls } from '@routes/route-urls';
import { useDrawers } from '@common/hooks/use-drawers';
import { useShowNetworksStore } from '@store/ui/ui.hooks';
import { NetworkList } from '@features/network-drawer/network-list';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

export const NetworksDrawer: React.FC = () => {
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
        <Button borderRadius="10px" onClick={handleAddNetworkClick}>
          Add a network
        </Button>
      </Box>
    </ControlledDrawer>
  );
};
