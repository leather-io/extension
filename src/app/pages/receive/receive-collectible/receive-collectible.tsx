import { useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { ReceiveCollectibleLayout } from './receive-collectible.layout';

export function ReceiveCollectible() {
  const navigate = useNavigate();
  return (
    <BaseDrawer title="Add collectible" isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <ReceiveCollectibleLayout />
      </Box>
    </BaseDrawer>
  );
}
