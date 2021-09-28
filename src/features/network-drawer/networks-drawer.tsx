import React, { useCallback } from 'react';
import { Box, Button } from '@stacks/ui';
import { ControlledDrawer } from '@components/drawer/controlled';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { ScreenPaths } from '@common/types';
import { useDrawers } from '@common/hooks/use-drawers';
import { useShowNetworksStore } from '@store/ui/ui.hooks';
import { NetworkList } from '@features/network-drawer/network-list';

export const NetworksDrawer: React.FC = () => {
  const { setShowNetworks } = useDrawers();
  const [isShowing] = useShowNetworksStore();
  const doChangeScreen = useChangeScreen();

  const handleAddNetworkClick = useCallback(() => {
    setShowNetworks(false);
    doChangeScreen(ScreenPaths.ADD_NETWORK);
  }, [setShowNetworks, doChangeScreen]);

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
