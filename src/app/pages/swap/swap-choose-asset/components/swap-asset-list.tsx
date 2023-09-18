import { useLocation, useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';
import { styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { useSwapContext } from '@app/pages/swap/swap.context';

import { SwapAsset, SwapFormValues } from '../../hooks/use-swap';
import { SwapAssetItem } from './swap-asset-item';
import { SwapAssetListLayout } from './swap-asset-list.layout';

interface SwapAssetList {
  assets: SwapAsset[];
}
export function SwapAssetList({ assets }: SwapAssetList) {
  const { fetchToAmount } = useSwapContext();
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();
  const location = useLocation();
  const navigate = useNavigate();

  const isFromList = get(location.state, 'swap') === 'from';
  const isToList = get(location.state, 'swap') === 'to';

  const selectableAssets = assets.filter(
    asset =>
      (isFromList && asset.name !== values.swapAssetTo?.name) ||
      (isToList && asset.name !== values.swapAssetFrom?.name)
  );

  async function onChooseAsset(asset: SwapAsset) {
    let from: SwapAsset | undefined;
    let to: SwapAsset | undefined;
    if (isFromList) {
      from = asset;
      to = values.swapAssetTo;
      await setFieldValue('swapAssetFrom', asset);
    } else if (isToList) {
      from = values.swapAssetFrom;
      to = asset;
      await setFieldValue('swapAssetTo', asset);
    }
    navigate(-1);
    if (from && to && values.swapAmountFrom) {
      const toAmount = await fetchToAmount(from, to, values.swapAmountFrom);
      await setFieldValue('swapAmountTo', toAmount);
    }
  }

  return (
    <SwapAssetListLayout>
      {selectableAssets.map(asset => (
        <styled.button
          key={asset.balance.symbol}
          onClick={() => onChooseAsset(asset)}
          textAlign="left"
          type="button"
        >
          <SwapAssetItem asset={asset} />
        </styled.button>
      ))}
    </SwapAssetListLayout>
  );
}
