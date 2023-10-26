import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { SwapSelectedAssetFrom } from './swap-selected-asset-from';
import { SwapSelectedAssetTo } from './swap-selected-asset-to';

const titleFrom = 'You pay';
const titleTo = 'You receive';

export function SwapSelectedAssets() {
  const navigate = useNavigate();

  function onChooseAssetFrom() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'from' } });
  }

  function onChooseAssetTo() {
    navigate(RouteUrls.SwapChooseAsset, { state: { swap: 'to' } });
  }

  return (
    <>
      <SwapSelectedAssetFrom onChooseAsset={onChooseAssetFrom} title={titleFrom} />
      <SwapSelectedAssetTo onChooseAsset={onChooseAssetTo} title={titleTo} />
    </>
  );
}
