import { useLocation, useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { SwapAsset, SwapFormValues } from '../../hooks/use-swap';
import { SwapAssetItem } from './swap-asset-item';
import { SwapAssetListLayout } from './swap-asset-list.layout';

interface SwapAssetList {
  assets: SwapAsset[];
}
export function SwapAssetList({ assets }: SwapAssetList) {
  const { setFieldValue } = useFormikContext<SwapFormValues>();
  const location = useLocation();
  const navigate = useNavigate();

  async function onChooseAsset(asset: SwapAsset) {
    if (get(location.state, 'swap') === 'from') await setFieldValue('swapAssetFrom', asset);
    if (get(location.state, 'swap') === 'to') await setFieldValue('swapAssetTo', asset);
    navigate(-1);
  }

  return (
    <SwapAssetListLayout>
      {assets.map(asset => (
        <styled.button
          key={asset.balance.symbol}
          onClick={() => onChooseAsset(asset)}
          textAlign="left"
        >
          <SwapAssetItem asset={asset} />
        </styled.button>
      ))}
    </SwapAssetListLayout>
  );
}
