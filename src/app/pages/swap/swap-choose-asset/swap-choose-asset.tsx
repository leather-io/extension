import { useNavigate } from 'react-router-dom';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { useSwapContext } from '../swap.context';
import { SwapAssetList } from './components/swap-asset-list';

export function SwapChooseAsset() {
  const { swappableAssets } = useSwapContext();
  const navigate = useNavigate();

  return (
    <BaseDrawer title="Select asset" isShowing onClose={() => navigate(-1)}>
      <SwapAssetList assets={swappableAssets} />
    </BaseDrawer>
  );
}
