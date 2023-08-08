import { useNavigate } from 'react-router-dom';

import { Box, Text, color } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Hr } from '@app/components/hr';

import { useSwappableAssets } from '../hooks/use-swappable-assets';
import { SwapAssetList } from './components/swap-asset-list';

export function SwapChooseAsset() {
  const navigate = useNavigate();
  const { swappableAssets } = useSwappableAssets();

  return (
    <BaseDrawer title="Select asset" isShowing onClose={() => navigate(-1)}>
      <Box p="extra-loose">
        <Text color={color('text-caption')} fontSize={2}>
          Tokens
        </Text>
        <Hr mb="loose" mt="tight" />
        <SwapAssetList assets={swappableAssets} />
      </Box>
    </BaseDrawer>
  );
}
