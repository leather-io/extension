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

  async function onChooseAsset(asset: SwapAsset) {
    let from: SwapAsset | undefined;
    let to: SwapAsset | undefined;
    if (get(location.state, 'swap') === 'from') {
      from = asset;
      to = values.swapAssetTo;
      await setFieldValue('swapAssetFrom', asset);
    } else if (get(location.state, 'swap') === 'to') {
      from = values.swapAssetFrom;
      to = asset;
      await setFieldValue('swapAssetTo', asset);
    }
    navigate(-1);
    if (values.swapAmountFrom && from && to) {
      await setFieldValue('swapAmountTo', '');
      const toAmount = await fetchToAmount(from, to, values.swapAmountFrom);
      await setFieldValue('swapAmountTo', toAmount);
    }
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
