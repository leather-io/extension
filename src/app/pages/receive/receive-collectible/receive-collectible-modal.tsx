import { useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ReceiveCollectible } from '@app/components/receive/receive-collectible';

export function ReceiveCollectibleModal() {
  const navigate = useNavigate();

  return (
    <BaseDrawer title="Add collectible" isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <ReceiveCollectible />
      </Box>
    </BaseDrawer>
  );
}
